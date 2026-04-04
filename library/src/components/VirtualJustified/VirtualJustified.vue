<template>
  <div
    ref="containerDOM"
    class="base-virtual-justified__container"
    :style="{
      height: !scrollContainer ? '100%' : '',
      overflow: !scrollContainer ? 'hidden auto' : '',
    }"
  >
    <!-- 包裹容器 -->
    <div
      ref="wrapDOM"
      class="base-virtual-justified__wrap"
      :style="{
        height: `${state.wrapState.height}px`,
      }"
    >
      <template v-for="(item, index) in state.visibleList" :key="item.id">
        <div
          class="base-virtual-justified__item"
          :class="{
            'base-virtual-justified__item__allow-transition':
              !!allowItemTransition,
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
            }"
          >
          </slot>
        </div>
      </template>
    </div>
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

import type { Item, Pos, VirtualJustifiedProps } from "./type";

import { useDebounceFn, useResizeObserver, useScroll } from "@vueuse/core";

defineOptions({
  name: "BaseVirtualJustified",
});

const props = withDefaults(defineProps<VirtualJustifiedProps>(), {
  items: () => [],
  gap: 5,
  targetRowHeight: 300,
  lastRowFill: false,
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
  rowPosList: [] as Pos[][], // 每一行的 item 位置信息
  isFreeze: false, // 冻结标识符
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

// j 间隙 (从prop中安全的获取结果)
const safeGap = computed(() => {
  return props.gap >= 0 ? props.gap : 0;
});

// j 目标行高 (从props中安全的获取结果)
const safeTargetRowHeight = computed(() => {
  // 100 的目标行高作为安全下限，防止视口内容过多
  return props.targetRowHeight > 0 ? props.targetRowHeight : 100;
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

// f 绑定滚动容器
function bindingScrollContainer(scrollContainer: HTMLElement | null) {
  state.scrollState = reactive(
    useScroll(scrollContainer, {
      onScroll(_e) {
        if (state.isFreeze) return;
        computedItemPosDebounce(props.items);
      },
    }),
  );
}

// w 对于 prop.items 只监听 id 变化
watch(
  [
    () => props.items.map((item) => item.id),
    () => safeTargetRowHeight.value,
    () => props.lastRowFill,
  ],
  async ([_newItems]) => {
    await nextTick();
    if (state.isFreeze) return;
    // items、gap 发生变化时重新计算布局
    computedItemPosDebounce(props.items);
  },
);

const computedItemPosDebounce = useDebounceFn((list: Item[]) => {
  requestAnimationFrame(async () => {
    await computedItemPos(list);
    computeVisibleStateRAF();
  });
}, 100);

// f 计算所有 item 位置 —— Justified Layout (自适应布局：按照预期行高进行计算)
async function computedItemPos(list: Item[]) {
  await nextTick();
  if (state.isFreeze) return;

  const targetRowHeight = safeTargetRowHeight.value;
  const gap = safeGap.value;
  // 控制最后一行是否也要强制铺满
  const lastRowFill = props.lastRowFill;

  const containerWidth = state.wrapState.width || 0;
  if (containerWidth <= 0) {
    // 容器宽度未就绪，延后计算
    state.itemsPos = new Array(list.length);
    state.rowPosList = [];
    state.wrapState.height = 0;
    return;
  }

  // 用来存放每个 item 的 Pos
  const newPos: Pos[] = new Array(list.length);

  // 临时行缓存，存的是 { item, index }
  let currentRow: { item: Item; index: number }[] = [];
  let currentRowAspectSum = 0;

  let top = 0;
  const rows: Pos[][] = [];

  for (let index = 0; index < list.length; index++) {
    const item = list[index];
    currentRow.push({ item, index });
    currentRowAspectSum += item.aspectRatio;

    // 如果一行把这些元素强制拉满，得到的高度
    const rowHeight =
      (containerWidth - gap * (currentRow.length - 1)) / currentRowAspectSum;

    // 可调：当行高过低时（图片被压得太扁）提前换行
    const shouldBreak = rowHeight < targetRowHeight && currentRow.length > 1;

    if (shouldBreak) {
      // 回退最后一个，先布局当前行
      const last = currentRow.pop()!;
      currentRowAspectSum -= last.item.aspectRatio;

      layoutRow(currentRow, false);
      // 新起一行，把被回退的项目放进新行
      currentRow = [last];
      currentRowAspectSum = last.item.aspectRatio;

      // 如果这个被回退的项目恰好是最后一个元素，那么它在新行中，且循环即将结束，需要立即布局。
      if (index === list.length - 1) {
        layoutRow(currentRow, true);
      }
    } else if (index === list.length - 1) {
      // 最后一行，布局（可选择不铺满）
      layoutRow(currentRow, true);
    }
  }

  function layoutRow(
    rowItems: { item: Item; index: number }[],
    isLastRow = false,
  ) {
    if (rowItems.length === 0) return;

    const aspectSum = rowItems.reduce((s, v) => s + v.item.aspectRatio, 0);
    const gapsTotal = gap * (rowItems.length - 1);

    let rowHeight: number;

    // 非最后一行：必须完全铺满，不做 clamp
    if (!isLastRow || lastRowFill) {
      rowHeight = (containerWidth - gapsTotal) / aspectSum;
    } else {
      // 最后一行不铺满：使用 targetRowHeight + clamp
      rowHeight = Math.min(
        targetRowHeight * 1.5,
        Math.max(targetRowHeight * 0.7, targetRowHeight),
      );
    }

    // 初次按 rowHeight 计算宽度
    let widths = rowItems.map((r) => rowHeight * r.item.aspectRatio);
    let totalContentWidth = widths.reduce((s, w) => s + w, 0);

    // 非最后一行 或 lastRowFill = true：必须再次缩放以填满
    if (!isLastRow || lastRowFill) {
      const scale = (containerWidth - gapsTotal) / totalContentWidth;
      rowHeight *= scale;
      widths = widths.map((w) => w * scale);
    }

    // 布局
    let left = 0;
    const rowPos: Pos[] = [];

    for (let i = 0; i < rowItems.length; i++) {
      const { item, index } = rowItems[i];
      const width = widths[i];

      const pos = {
        id: item.id,
        realIndex: index,
        left,
        top,
        width,
        height: rowHeight,
      };

      newPos[index] = pos;
      rowPos.push(pos);
      left += width + gap;
    }

    rows.push(rowPos);
    top += rowHeight + gap;
  }

  // 写回状态（注意：我们复用 columnPosList 来存放“行列表”，以兼容你现有的可见性逻辑）
  state.itemsPos = newPos;
  state.rowPosList = rows;
  state.list = list;
  // wrap 总高度：若无 items 则为 0，否则最后 top 会多加一个 gap，需要减去
  state.wrapState.height = rows.length > 0 ? top - gap : 0;
}

// 使用 rAF 封装
let ticking = false;
const computeVisibleStateRAF = () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      computeVisibleState();
      ticking = false;
    });
    ticking = true;
  }
};

// f 计算可见状态 —— 按行虚拟化
function computeVisibleState() {
  const paddingTop = state.viewportState.paddingTop;

  let scrollY = Math.floor(state.scrollState.y);
  if (!!props.scrollContainer) {
    scrollY = scrollY > paddingTop ? scrollY - paddingTop : 0;
  }

  const viewBottom = scrollY + state.viewportState.height;

  const visiblePosList: Pos[] = [];

  // ⚠️ columnPosList 现在存放的是“行”
  for (const row of state.rowPosList) {
    if (row.length === 0) continue;

    const rowTop = row[0].top;
    const rowHeight = row[0].height;
    const rowBottom = rowTop + rowHeight;

    // 这一整行是否与可视区域相交？
    if (rowBottom < scrollY || rowTop > viewBottom) {
      continue;
    }

    // 整行可见
    for (const pos of row) {
      visiblePosList.push(pos);
    }
  }

  // 按照真实索引排序
  const sortedPosList = [...visiblePosList].sort(
    (a, b) => a.realIndex - b.realIndex,
  );
  // 按照真实索引排序后的数据
  const sortedDataList = sortedPosList.map((p) => state.list[p.realIndex]);

  // 一次性同步到响应式状态
  state.visiblePosList = sortedPosList;
  state.visibleList = sortedDataList;
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
.base-virtual-justified {
  /* &__container {
		} */

  &__wrap {
    position: relative;
    width: 100%;
    /* border: 1px solid rgb(123, 123, 123); */
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
