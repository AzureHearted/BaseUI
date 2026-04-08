<!-- 分栏组件 -->
<template>
  <div
    ref="containerRef"
    class="base-split"
    :class="{
      [`base-split__vertical`]: vertical,
    }"
  >
    <!-- first区域 -->
    <div ref="pane1Ref" class="base-split__first" :style="[pane1Style]">
      <slot name="1"></slot>
    </div>
    <!-- 控制条 -->
    <div
      ref="resizeTriggerRef"
      class="base-split__resize"
      tabindex="-1"
      @mousedown.prevent="handleTreggerMouseDown"
      @dblclick="handleTreggerDoubleClick"
    ></div>
    <!-- second区域 -->
    <div ref="pane2Ref" class="base-split__second" :style="[pane2Style]">
      <slot name="2"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  onMounted,
  reactive,
  ref,
  useTemplateRef,
  watch,
  type ShallowRef,
} from "vue";
import type { SplitProps } from "./types";
import { useElementSize, watchOnce } from "@vueuse/core";

defineOptions({
  name: "BaseSplit",
});

const props = withDefaults(defineProps<SplitProps>(), {
  defaultSize: 0.5,
  resizeTriggerSize: 1,
  resizeTriggerHotAreaExtend: 1,
  resizeTriggerHoverExtend: 0.5,
  pane1Overflow: "auto",
  pane2Overflow: "auto",
  resizeTriggerColor: "hsl(228, 3%, 31%)",
  resizeTriggerHoverColor: "hsl(211, 58%, 49%)",
});

const containerRef = useTemplateRef(
  "containerRef",
) as ShallowRef<HTMLDivElement | null>;
// const pane1Ref = useTemplateRef('pane1Ref') as ShallowRef<HTMLDivElement | null>
// const pane2Ref = useTemplateRef('pane2Ref') as ShallowRef<HTMLDivElement | null>
// const resizeTriggerRef = useTemplateRef('resizeTriggerRef') as ShallowRef<HTMLDivElement | null>

const containerInfo = useElementSize(containerRef);
const containerSize = computed(() => {
  return Math.floor(
    props.vertical ? containerInfo.height.value : containerInfo.width.value,
  );
});

// const resizeTriggerInfo = useElementSize(resizeTriggerRef)
// const resizeTriggerSize = computed(() => {
// 	return props.vertical ? resizeTriggerInfo.height.value : resizeTriggerInfo.width.value
// })

const size = defineModel<number | string>("size");

onMounted(() => {
  if (containerSize.value !== 0) {
    initSize();
  } else {
    watchOnce(containerSize, () => {
      initSize();
    });
  }
});

// f 初始化
function initSize() {
  const containerDom = containerRef.value;
  if (!containerDom) return;

  let iSize = size.value ?? props.defaultSize;

  updateSize(parseSizeToNumber(iSize), props.basePane);

  // ? 更新百分比
  state.percentage = pane1Size.value / containerSize.value;
}

// f 计算size值
function parseSizeToNumber(size: string | number) {
  if (typeof size === "number") {
    return containerSize.value * size;
  } else {
    return parseFloat(size);
  }
}

/**
 * 更新区域尺寸
 * @param baseSize 基准区域尺寸
 * @param basePane 基准区域
 */
function updateSize(baseSize: number, basePane: 1 | 2 | false | undefined) {
  const cSize = containerSize.value;
  let bSize = baseSize;
  if (bSize < baseMinSize.value) bSize = baseMinSize.value;
  if (bSize > baseMaxSize.value) bSize = baseMaxSize.value;
  let aSize = cSize - bSize;
  // 当空间足够时，对非基准区域的尺寸进行判断
  if (
    aSize < anotherMinSize.value &&
    cSize - anotherMinSize.value >= baseMinSize.value
  ) {
    aSize = anotherMinSize.value;
    // 反过来计算 bSize
    bSize = cSize - aSize;
  }

  if (
    aSize > anotherMaxSize.value &&
    cSize - anotherMaxSize.value <= baseMaxSize.value
  ) {
    aSize = anotherMaxSize.value;
    // 反过来计算 bSize
    bSize = cSize - aSize;
  }

  if (!basePane || basePane === 1) {
    // pane1 为基准的情况
    pane1Size.value = bSize;
    pane2Size.value = aSize;
  } else {
    // pane2 为基准的情况
    pane1Size.value = aSize;
    pane2Size.value = bSize;
  }
}

watch(
  () => size.value,
  (value, oldValue) => {
    if (value === oldValue) return;
    const pSize = value != null ? parseSizeToNumber(value) : null;
    if (pSize == null) return;
    const cSize = containerSize.value;

    updateSize(pSize, props.basePane);

    // ? 更新百分比
    state.percentage = pane1Size.value / cSize;
  },
);

// s 状态数据
const state = reactive({
  isDragging: false, // 拖拽标识符
  percentage: 0.5, // 百分比
});

const pane1Size = ref<number>(0);
const pane2Size = ref<number>(0);

// j 控制条最大尺寸(含不可见尺寸)
const resizeTriggerMaxSize = computed(() => {
  return Math.max(
    props.resizeTriggerSize + props.resizeTriggerHoverExtend * 2,
    props.resizeTriggerSize + props.resizeTriggerHotAreaExtend * 2,
  );
});

// j 区域允许的最小尺寸 (优先级低于base、another)
const minSize = computed(() => {
  if (props.min == null) return 0;
  return Math.max(parseSizeToNumber(props.min), 0);
});

// j 区域允许的最大尺寸 (优先级低于base、another)
const maxSize = computed(() => {
  if (props.max == null) return containerSize.value;
  return Math.min(
    parseSizeToNumber(props.max),
    containerSize.value - props.resizeTriggerSize,
  );
});

// j 基准区域允许的最小尺寸
const baseMinSize = computed(() => {
  if (props.baseMin == null) return minSize.value;
  return Math.max(parseSizeToNumber(props.baseMin), 0);
});

// j 基准区域的最大尺寸
const baseMaxSize = computed(() => {
  if (props.baseMax == null) return maxSize.value;
  return Math.min(
    parseSizeToNumber(props.baseMax),
    containerSize.value - props.resizeTriggerSize,
  );
});

// j 非基准区域允许的最小尺寸
const anotherMinSize = computed(() => {
  if (props.anotherMin == null) return minSize.value;
  return Math.max(parseSizeToNumber(props.anotherMin), 0);
});

// j 非基准区域的最大尺寸
const anotherMaxSize = computed(() => {
  if (props.anotherMax == null) return maxSize.value;
  return Math.min(
    parseSizeToNumber(props.anotherMax),
    containerSize.value - props.resizeTriggerSize,
  );
});

// f 更新 model 值
function updateModel() {
  if (typeof size.value === "number") {
    size.value = state.percentage;
  } else if (typeof size.value === "string") {
    size.value = `${Math.floor(pane1Size.value)}px`;
  }
}

watch(containerSize, (cSize, oldCSize) => {
  if (cSize === oldCSize) return;
  handleSplitScale();
});

// f 处理Split容器尺寸变化时的情况
function handleSplitScale() {
  if (!containerRef.value) return;
  const cSize = containerSize.value;

  if (props.basePane) {
    updateSize(
      !props.basePane || props.basePane === 1
        ? pane1Size.value
        : pane2Size.value,
      props.basePane,
    );
    state.percentage = pane1Size.value / cSize;
    updateModel();
  } else {
    // 未指定固定pane的情况
    updateSize(Math.round(cSize * state.percentage), props.basePane);
    updateModel();
  }
}

// f 鼠标按下分栏控制条的回调
function handleTreggerMouseDown(e: MouseEvent) {
  // ? 先清空选区
  window.getSelection()?.removeAllRanges();

  const cSize = containerSize.value;

  // 鼠标起始位置
  let start = !props.vertical ? e.clientX : e.clientY;

  // pane1 区域起始宽度
  let pane1StartSize = pane1Size.value;
  pane1StartSize = pane1StartSize < 0 ? 0 : pane1StartSize;
  pane1StartSize =
    pane1StartSize > cSize - props.resizeTriggerSize
      ? cSize - props.resizeTriggerSize
      : pane1StartSize;

  // 设置全局鼠标样式
  document.body.style.cursor = !props.vertical ? "e-resize" : "n-resize";

  // 注册：鼠标移动事件
  document.addEventListener("mousemove", handleMouseMove);
  let rafId: number | null = null;
  // f 移动回调
  function handleMouseMove(e: MouseEvent) {
    // 标记为正在拖拽
    state.isDragging = true;
    // 鼠标拖动的终止位置
    let end = !props.vertical ? e.clientX : e.clientY;

    // ? 计算 first 区域结束位置宽度
    let pane1EndSize = pane1StartSize + (end - start);
    let pane2EndSize = cSize - pane1EndSize;

    updateSize(
      !props.basePane || props.basePane === 1 ? pane1EndSize : pane2EndSize,
      props.basePane,
    );

    // ? 更新百分比
    state.percentage = pane1Size.value / cSize;

    // 若持续执行则清除上一次的raf句柄
    if (rafId) cancelAnimationFrame(rafId);
    // 下一个渲染帧更新
    rafId = requestAnimationFrame(() => {
      // ? 更新 model 值
      updateModel();
      rafId = null;
    });
  }

  // 注册：鼠标松开事件
  document.addEventListener("mouseup", handleMouseUp);
  function handleMouseUp(_e: MouseEvent) {
    // 标记为正在未拖拽
    state.isDragging = false;
    // 移除监听注册
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    // 移除全局鼠标样式
    document.body.style.cursor = "";
  }
}

// f 处理 trigger 双击事件
function handleTreggerDoubleClick(_e: MouseEvent) {
  const cSize = containerSize.value;

  updateSize(parseSizeToNumber(props.defaultSize), props.basePane);

  // ? 更新百分比
  state.percentage = pane1Size.value / cSize;

  updateModel();
}
</script>

<style lang="scss" scoped>
.base-split {
  // 控制条宽度
  --resize-trigger-size: calc(v-bind("$props.resizeTriggerSize") * 1px);
  // 控制条热区扩展尺寸
  --resize-trigger-hot-area-extend: calc(
    v-bind("$props.resizeTriggerHotAreaExtend") * 1px
  );
  // 控制条hover扩展尺寸
  --resize-trigger-hover-extend: calc(
    v-bind("$props.resizeTriggerHoverExtend") * 1px
  );
  // 安全尺寸
  --safe-size: calc(
    (v-bind("resizeTriggerMaxSize") * 1px) / 2 - var(--resize-trigger-size) / 2
  );

  --resize-color: v-bind("$props.resizeTriggerColor");
  --resize-hover-color: v-bind("$props.resizeTriggerHoverColor");
}

.base-split {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;

  // * 水平布局
  & {
    flex-direction: row;
    flex-wrap: nowrap;

    // ? first 区域样式
    & > &__first {
      flex: 0 0 calc(v-bind("pane1Size") * 1px);
      min-inline-size: var(--safe-size);
      max-inline-size: calc(
        100% - (v-bind("resizeTriggerMaxSize") * 1px) + var(--safe-size)
      );
      overflow: v-bind("$props.pane1Overflow");
    }

    // ? second 区域样式
    & > &__second {
      flex: 1;
      overflow: v-bind("$props.pane2Overflow");
    }

    // 拖拽控制条
    & > &__resize {
      position: relative;
      background-color: var(--resize-color);
      // 分栏条宽度
      flex-basis: var(--resize-trigger-size);
      background-size: cover;
      background-position: center;

      // 鼠标悬浮和激活的样式
      cursor: e-resize;

      // 拖拽控制条：视觉条
      &::after {
        content: "";
        position: absolute;
        inset: 0;
        width: var(--resize-trigger-size);
        height: 100%;
        z-index: 1;
        transition:
          width 0.15s,
          left 0.15s,
          background-color 0.15s,
          inset 0.15s;
      }

      // 拖拽控制条：扩展控条热区
      &::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: calc(-1 * var(--resize-trigger-hot-area-extend));
        right: calc(-1 * var(--resize-trigger-hot-area-extend));
        z-index: 1;
      }

      &:hover::after,
      &:active::after {
        inset: 0;
        height: 100%;
        width: calc(
          var(--resize-trigger-size) + (var(--resize-trigger-hover-extend) * 2)
        );
        left: calc(-1 * var(--resize-trigger-hover-extend));
        background-color: var(--resize-hover-color);
      }
    }

    // * 垂直布局
    &__vertical {
      flex-direction: column;
      flex-wrap: nowrap;
    }

    &__vertical > &__resize {
      // 分栏条宽度
      height: var(--resize-trigger-size);

      // 鼠标悬浮和激活的样式
      cursor: n-resize;

      // 拖拽控制条：视觉条
      &::after {
        width: 100%;
        height: var(--resize-trigger-size);
      }

      // 拖拽控制条：扩展控条热区
      &::before {
        top: calc(-1 * var(--resize-trigger-hot-area-extend));
        bottom: calc(-1 * var(--resize-trigger-hot-area-extend));
        left: 0;
        right: 0;
      }

      &:hover::after,
      &:active::after {
        width: 100%;
        height: calc(
          var(--resize-trigger-size) + var(--resize-trigger-hover-extend) * 2
        );
        top: calc(-1 * var(--resize-trigger-hover-extend));
      }
    }
  }
}
</style>
