<template>
  <div
    ref="containerDOM"
    class="base-virtual-grid__container"
    :style="{
      height: scrollContainerDOM != null ? '100%' : '',
      overflow: scrollContainerDOM != null ? 'hidden auto' : '',
    }"
  >
    <!-- 包裹容器 -->
    <div
      ref="wrapDOM"
      class="base-virtual-grid__wrap"
      :style="{
        height: `${state.wrapState.height}px`,
      }"
    >
      <template v-for="(item, index) in state.visibleList" :key="item.id">
        <div
          class="base-virtual-grid__item"
          :class="{
            'base-virtual-grid__item__allow-transition': !!allowItemTransition,
          }"
          :data-index="state.visiblePosList[index].realIndex"
          :style="{
            width: `${state.visiblePosList[index].width}px`,
            height: `${state.visiblePosList[index].height}px`,
            transform: `translate(${state.visiblePosList[index].left}px, ${state.visiblePosList[index].top}px)`,
          }"
        >
          <!-- 插槽出口 -->
          <slot
            v-bind="{
              item,
              index: state.visiblePosList[index].realIndex,
              isSkeleton:
                state.visibleStateMap.get(state.visiblePosList[index].id) !==
                'item',
            }"
          >
          </slot>
        </div>
      </template>
    </div>
    <base-back-to-top :scroll-container="scrollContainerDOM" />
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onActivated,
  onDeactivated,
  onMounted,
  reactive,
  useTemplateRef,
  watch,
  type ShallowRef,
} from "vue";

import type { Item, Pos, VirtualGridProps } from "./type";

import { useDebounceFn, useResizeObserver, useScroll } from "@vueuse/core";
import { BaseBackToTop } from "../BackToTop";

defineOptions({
  name: "BaseVirtualGrid",
});

const props = withDefaults(defineProps<VirtualGridProps>(), {
  items: () => [],
  gap: 5,
  columns: 3,
});

// s 容器DOM
const containerDOM = useTemplateRef(
  "containerDOM",
) as ShallowRef<HTMLDivElement | null>;
// s wrap容器DOM
const wrapDOM = useTemplateRef("wrapDOM") as ShallowRef<HTMLDivElement | null>;

// s 状态数据
const state = reactive({
  list: [] as Item[], // 所有item列表
  visibleList: [] as Item[], // 可见的item列表
  itemsPos: [] as Pos[], // 所有item的位置信息列表
  visiblePosList: [] as Pos[], // 可见item的位置信息列表
  visibleStateMap: new Map<string, "item" | "skeleton">(), // 可见类型状态映射
  isFreeze: false,
  viewportState: {
    width: 0,
    height: 0,
    scrollWidth: 0,
    scrollHeight: 0,
    paddingTop: 0,
  },
  wrapState: {
    width: 0,
    height: 0,
  },
  scrollState: useScroll(containerDOM),
});

// j 滚动容器的DOM
const scrollContainerDOM = computed(() => {
  return props.scrollContainer ? props.scrollContainer : containerDOM.value;
});

// j 每列列宽
const columnWidth = computed(() => {
  const colWidth =
    (state.wrapState.width - (safeColumns.value - 1) * safeGap.value) /
    safeColumns.value;
  return colWidth;
});

// j 间隙 (从prop中安全的获取结果)
const safeGap = computed(() => {
  return props.gap >= 0 ? props.gap : 0;
});

// j 列数 (从prop中安全的获取结果)
const safeColumns = computed(() => {
  // 判断是否传入breakpoints
  if (props.breakpoints && Object.keys(props.breakpoints).length > 0) {
    // 从最大的断点开始检查
    for (const breakpoint of sortedBreakpoints.value) {
      if (state.wrapState.width >= breakpoint) {
        // 找到第一个满足条件的断点，并返回其列数
        return props.breakpoints[breakpoint];
      }
    }
    // 如果容器宽度小于所有断点，则返回最小断点的列数（通常是 '0' 键）
    return props.breakpoints[0];
  } else {
    return props.columns > 0 ? props.columns : 1;
  }
});

// j 缓存和排序断点键名，只执行一次
const sortedBreakpoints = computed(() => {
  return Object.keys(props.breakpoints || {})
    .map((key) => parseInt(key))
    .sort((a, b) => b - a); // 降序排序，从最大断点开始检查
});

// w 组件挂载时进行初始化
onMounted(() => {
  init();
});

// f 初始化
async function init() {
  await nextTick();

  state.wrapState.width = wrapDOM.value?.clientWidth || 0;
  state.viewportState.width =
    (!!props.scrollContainer
      ? containerDOM.value?.clientWidth
      : state.wrapState.width) || 0;

  // ? 组件挂载后重新绑定滚动容器 (因为挂载前可能传入scrollContainer还未挂载)
  bindingScrollContainer(scrollContainerDOM.value);

  // ? 如果滚动容器变化时则需要重新绑定监听
  watch(scrollContainerDOM, (dom, oldDOM) => {
    if (dom === oldDOM) return;
    if (!dom) return;
    const oldScrollState = state.scrollState;
    bindingScrollContainer(dom);
    if (state.isFreeze) return;
    state.scrollState.x = oldScrollState.x;
    state.scrollState.y = oldScrollState.y;
  });

  // ? 监听滚动容器的尺寸
  useResizeObserver(scrollContainerDOM.value, (entries) => {
    if (state.isFreeze) return;

    state.viewportState.width = entries[0].contentRect.width;
    state.viewportState.height = entries[0].contentRect.height;
    state.viewportState.scrollWidth = entries[0].target.scrollWidth;
    state.viewportState.scrollHeight = entries[0].target.scrollHeight;

    state.viewportState.paddingTop = Math.floor(
      (wrapDOM.value?.getBoundingClientRect().y || 0) +
        state.scrollState.y -
        (props.scrollContainer?.getBoundingClientRect().y || 0),
    );

    state.wrapState.width = wrapDOM.value?.clientWidth || 0;
    computedItemPosDebounce(props.items);
  });

  // ? 初始化完成后立即执行一次布局计算
  computedItemPosDebounce(props.items);
}

let timer: number;
// f 绑定滚动容器
function bindingScrollContainer(scrollContainer: HTMLElement | null) {
  state.scrollState = reactive(
    useScroll(scrollContainer, {
      onScroll(_e) {
        if (state.isFreeze) return;
        computeVisibleStateRAF(true);
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          clearTimeout(timer);
          if (state.scrollState.isScrolling) {
            return;
          }
          computeVisibleStateRAF();
        }, 300);
      },
    }),
  );
}

// w 对于 prop.items 只监听 id 变化
watch(
  [() => props.items.map((item) => item.id), () => safeColumns.value],
  async ([_newItemIds]) => {
    await nextTick();
    if (state.isFreeze) return;
    // items、gap 发生变化时重新计算布局
    computedItemPosDebounce(props.items);
  },
);

const computedItemPosDebounce = useDebounceFn((list: Item[]) => {
  requestAnimationFrame(() => {
    computedItemPos(list);
    computeVisibleStateRAF();
  });
}, 100);

// f 计算所有item位置
async function computedItemPos(list: Item[]) {
  await nextTick();
  if (state.isFreeze) return;

  const width = columnWidth.value;
  const height = width;
  const column = safeColumns.value;
  const gap = safeGap.value;

  const newPos: Pos[] = new Array(list.length);
  for (let index = 0; index < list.length; index++) {
    const left = (width + gap) * (index % column);
    const top = (height + gap) * Math.floor(index / column);
    newPos[index] = {
      id: list[index].id,
      realIndex: index,
      left,
      top,
      width,
      height,
    };
  }

  // 批量替换响应式 itemsPos —— 这只会触发一次更新
  state.itemsPos = newPos;

  // 如果你维护 state.list 同步必要，类似批量替换
  state.list = list;

  // wrap height 也批量算（不要在循环里赋值）
  const row = Math.ceil(list.length / column);
  state.wrapState.height = height * row + gap * (row - 1);
}

// 使用 rAF 封装
let ticking = false;
const computeVisibleStateRAF = (isScrolling: boolean = false) => {
  if (!ticking) {
    requestAnimationFrame(() => {
      computeVisibleState(isScrolling);
      ticking = false;
    });
    ticking = true;
  }
};

// f 计算可见可见状态
function computeVisibleState(isScrolling: boolean = false) {
  if (state.isFreeze) return;

  const itemHeight = columnWidth.value;
  const gap = safeGap.value;
  const h = itemHeight + gap;
  const cols = safeColumns.value;

  const bufferCount = 1; // 缓冲区个数

  // 计算paddingTop
  const paddingTop = state.viewportState.paddingTop;
  let scrollY = Math.floor(state.scrollState.y);
  // 根据paddingTop进行修正
  if (!!props.scrollContainer) {
    scrollY = scrollY > paddingTop ? scrollY - paddingTop : 0;
  }

  const viewTop = scrollY;
  const viewBottom = scrollY + state.viewportState.height;

  // 可见行区域
  const visibleStartRow = Math.floor(viewTop / h);
  const visibleEndRow = Math.floor(viewBottom / h);

  // 总共要显示的区域
  const startRow = visibleStartRow - bufferCount;
  const endRow = visibleEndRow + bufferCount;

  const startIndex = Math.max(startRow * cols, 0);
  const endIndex = Math.min((endRow + 1) * cols - 1, state.list.length - 1);

  const visiblePosList = state.itemsPos.slice(startIndex, endIndex + 1);
  const visibleList = state.list.slice(startIndex, endIndex + 1);

  if (!isScrolling) state.visibleStateMap.clear();

  // 遍历所有可见区域记录状态
  visiblePosList.forEach((pos) => {
    if (isScrolling) {
      const oldState = state.visibleStateMap.get(pos.id);
      state.visibleStateMap.set(pos.id, oldState ?? "skeleton");
    } else {
      if (pos.top + pos.height >= scrollY && pos.top <= viewBottom) {
        state.visibleStateMap.set(pos.id, "item");
      } else {
        // 针对不可见项的设置
        state.visibleStateMap.set(pos.id, "skeleton");
      }
    }
  });

  state.visiblePosList = visiblePosList;
  state.visibleList = visibleList;
}

/**
 * f 滚动到指定元素位置
 * @param id 元素id
 */
async function scrollToItem(id: string) {
  await nextTick();
  if (state.isFreeze) return;
  // 如果没有滚动容器则直接返回
  if (!scrollContainerDOM.value) return;
  const index = state.list.findIndex((item) => item.id === id);
  // 如果找不到元素则直接返回
  if (index < 0) return;
  // 拿到元素位置信息
  const pos = state.itemsPos[index];
  // 如果找不到元素位置信息则直接返回
  if (!pos) return;
  const { left, top, width, height } = pos;
  // 拿到滚动容器信息
  const { scrollLeft, scrollTop, clientWidth, clientHeight } =
    scrollContainerDOM.value;
  // 计算目标滚动位置
  const scrollLeftTarget = Math.max(0, left - (clientWidth - width) / 2);
  const scrollTopTarget = Math.max(0, top - (clientHeight - height) / 2);
  // 只有当目标位置与当前位置不同时才滚动
  if (scrollLeft !== scrollLeftTarget || scrollTop !== scrollTopTarget) {
    scrollContainerDOM.value.scrollTo({
      left: scrollLeftTarget,
      top: scrollTopTarget,
      behavior: "smooth",
    });
  }
}

// w 当组件冻结时
onDeactivated(() => {
  state.isFreeze = true;
});
// w 当组件激活时 (挂载时也会触发)
onActivated(() => {
  state.isFreeze = false;
  // 恢复到原来滚动位置
  state.scrollState.y = state.scrollState.y;
  state.scrollState.x = state.scrollState.x;
});

// ? 暴露方法和属性
defineExpose({
  scrollContainerDOM,
  scrollToItem,
});
</script>

<style lang="scss" scoped>
/* 容器 */
.base-virtual-grid {
  &__container {
    // 自定义滚动条颜色
    scrollbar-color: rgb(85, 170, 255) transparent;
    scrollbar-gutter: stable;
  }

  &__wrap {
    position: relative;
    width: 100%;
  }

  &__item {
    position: absolute;
    /* overflow: hidden; */
    /* background-color: rgba(126, 126, 126, 0.3); */
    &__allow-transition {
      will-change: transform;
      transition: 0.5s ease;
    }
  }
}
</style>
