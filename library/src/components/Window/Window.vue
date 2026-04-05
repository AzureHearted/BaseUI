<template>
  <div
    v-if="show"
    class="base-window"
    :data-maximized="state.maximized"
    :data-minimized="state.minimized"
    :style="[style, sizeStyle]"
  >
    <BaseFrame
      ref="frameRef"
      :title="title"
      :is-max="state.maximized"
      class="base-window__frame"
      style="width: 100%; height: 100%"
      :content-style="contentStyle"
      v-bind="$attrs"
      :show-close-button="showCloseButton"
      :show-max-button="showMaxButton"
      :show-min-button="showMinButton"
      @window-change="onChangeWindow"
      @titlebar-dblclick="onChangeWindow('scale')"
    >
      <template #title-bar>
        <slot name="title-bar"></slot>
      </template>
      <template #title-bar-left>
        <slot name="title-bar-left"></slot>
      </template>
      <template #title-bar-middle>
        <slot name="title-bar-middle"></slot>
      </template>
      <template #default>
        <slot></slot>
      </template>
    </BaseFrame>
    <!-- 四边 -->
    <div
      class="base-window__resize-bar resize-bar__top-bar"
      @pointerdown="onPointerdownResizeBar('top', $event)"
    />
    <div
      class="base-window__resize-bar resize-bar__left-bar"
      @pointerdown="onPointerdownResizeBar('left', $event)"
    />
    <div
      class="base-window__resize-bar resize-bar__right-bar"
      @pointerdown="onPointerdownResizeBar('right', $event)"
    />
    <div
      class="base-window__resize-bar resize-bar__bottom-bar"
      @pointerdown="onPointerdownResizeBar('bottom', $event)"
    />
    <!-- 四角 -->
    <div
      class="base-window__resize-bar resize-bar__left-top-bar"
      @pointerdown="onPointerdownResizeBar('left-top', $event)"
    />
    <div
      class="base-window__resize-bar resize-bar__right-top-bar"
      @pointerdown="onPointerdownResizeBar('right-top', $event)"
    />
    <div
      class="base-window__resize-bar resize-bar__left-bottom-bar"
      @pointerdown="onPointerdownResizeBar('left-bottom', $event)"
    />
    <div
      class="base-window__resize-bar resize-bar__right-bottom-bar"
      @pointerdown="onPointerdownResizeBar('right-bottom', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  useTemplateRef,
  reactive,
  onMounted,
  onUnmounted,
  watch,
  ref,
  onActivated,
  onDeactivated,
} from "vue";
import type { ShallowRef, StyleValue } from "vue";
import BaseFrame from "./Frame.vue";
import {
  useDraggable,
  useElementBounding,
  useElementSize,
  useWindowSize,
  unrefElement,
  type MaybeComputedElementRef,
} from "@vueuse/core";
import type { WindowEmits, WindowProps } from "./types";

defineOptions({
  name: "BaseWindow",
});

const props = withDefaults(defineProps<WindowProps>(), {
  initWidth: 500,
  initHeight: 400,
  showMaxButton: true,
  showCloseButton: true,
  showMinButton: true,
  minWidth: 200,
  minHeight: 120,
  safeBoundary: () => ({
    left: 4,
    top: 4,
    right: 4,
    bottom: 4,
  }),
});

const emits = defineEmits<WindowEmits>();

const show = defineModel<boolean>("show", { default: false });

// 窗口框架引用
const frameRef = useTemplateRef("frameRef") as ShallowRef<
  InstanceType<typeof BaseFrame>
>;
const frameBounding = useElementBounding(() => frameRef.value?.$el);

// s 组件状态
const state = reactive({
  width: props.initWidth,
  height: props.initHeight,
  minimized: false,
  maximized: false,
  boundaryDOM: null as MaybeComputedElementRef,
  /** 冻结标识符 */
  isFreezed: false,
});

// ? 处理冻结和激活的情况
// 用于记录冻结前的位置
let oldPos: { x: number; y: number } | undefined;

// w 冻结时
onDeactivated(() => {
  oldPos = { x: position.value.x || 0, y: position.value.y || 0 };
  state.isFreezed = true;
});

// w 激活时
onActivated(() => {
  state.isFreezed = false;
  if (!oldPos) return;
  position.value = oldPos;
});

// j 尺寸样式
const sizeStyle = computed<StyleValue>(() => {
  let newStyle: StyleValue = {};
  if (!state.maximized) {
    newStyle = {
      width: `${state.width}px`,
      height: `${state.height}px`,
    };
  } else {
    const { left, top, right, bottom, width, height } = boundaryBounding;
    newStyle = {
      left: `${left.value + props.safeBoundary.left}px`,
      top: `${top.value + props.safeBoundary.top}px`,
      right: `${right.value - left.value - width.value + props.safeBoundary.right}px`,
      bottom: `${bottom.value - top.value - height.value + props.safeBoundary.bottom}px`,
    };
  }
  newStyle.position = state.boundaryDOM ? "fixed" : "fixed";
  return newStyle;
});

// 容器尺寸
let boundarySize:
  | ReturnType<typeof useElementSize>
  | ReturnType<typeof useWindowSize>;
let boundaryBounding: ReturnType<typeof useElementBounding>;

let style: ReturnType<typeof useDraggable>["style"];
let position: ReturnType<typeof useDraggable>["position"];

// w 组件挂载时
onMounted(() => {
  state.boundaryDOM = unrefElement(props.boundaryContainer);
  if (state.boundaryDOM) {
    const { stop, width, height } = useElementSize(state.boundaryDOM);
    boundarySize = { width, height };
    boundaryBounding = useElementBounding(state.boundaryDOM);
    onUnmounted(() => {
      stop();
    });
  } else {
    boundarySize = useWindowSize();
    boundaryBounding = {
      ...boundarySize,
      x: ref(0),
      y: ref(0),
      top: ref(0),
      left: ref(0),
      bottom: boundarySize.height,
      right: boundarySize.width,
      update() {},
    };
  }

  // 配置拖拽
  ({ style, position } = useDraggable(() => frameRef.value?.$el, {
    preventDefault: true,
    stopPropagation: true,
    handle: () => frameRef.value?.titleBarRef?.$el,
    initialValue: () => {
      boundaryBounding.update();
      const initPos = { x: 0, y: 0 };
      const { top, left, width, height } = boundaryBounding;

      if (state.width > width.value) {
        initPos.x = left.value;
      } else {
        initPos.x = left.value + (width.value - state.width) / 2;
      }
      if (state.height > height.value) {
        initPos.y = top.value;
      } else {
        initPos.y = top.value + (height.value - state.height) / 2;
      }
      return initPos;
    },
    onStart() {
      if (state.maximized || state.minimized) {
        return false;
      } else {
        return undefined;
      }
    },
    onMove(pos) {
      const newPos = { x: pos.x, y: pos.y };
      const { top, left, right, bottom } = boundaryBounding;

      // 上下边界
      if (
        newPos.y + frameBounding.height.value >
        bottom.value - props.safeBoundary.bottom
      ) {
        newPos.y =
          bottom.value - props.safeBoundary.bottom - frameBounding.height.value;
      }
      if (newPos.y < top.value + props.safeBoundary.top) {
        newPos.y = top.value + props.safeBoundary.top;
      }
      // 左右边界
      if (
        newPos.x + frameBounding.width.value >
        right.value - props.safeBoundary.right
      ) {
        newPos.x =
          right.value - props.safeBoundary.right - frameBounding.width.value;
      }
      if (newPos.x < left.value + props.safeBoundary.left) {
        newPos.x = left.value + props.safeBoundary.left;
      }
      position.value = newPos;
    },
  }));

  // 监听容器bounding变化
  watch(
    () => boundaryBounding,
    (bounding) => {
      if (state.maximized || state.minimized || state.isFreezed) return;

      // 如果还没拖拽过就按照默认位置调整
      requestAnimationFrame(() => {
        const newPos = { x: position.value.x, y: position.value.y };
        const { left, top, right, bottom } = bounding;

        // 上下边界
        if (
          newPos.y + frameBounding.height.value >
          bottom.value - props.safeBoundary.bottom
        ) {
          newPos.y =
            bottom.value -
            props.safeBoundary.bottom -
            frameBounding.height.value;
        }
        if (newPos.y < top.value + props.safeBoundary.top) {
          newPos.y = top.value + props.safeBoundary.top;
        }
        // 左右边界
        if (
          newPos.x + frameBounding.width.value >
          right.value - props.safeBoundary.right
        ) {
          newPos.x =
            right.value - props.safeBoundary.right - frameBounding.width.value;
        }
        if (newPos.x < left.value + props.safeBoundary.left) {
          newPos.x = left.value + props.safeBoundary.left;
        }

        position.value = newPos;
      });
    },
    { deep: true },
  );
});

// f 调整窗口大小
function onPointerdownResizeBar(
  type:
    | "top"
    | "left"
    | "right"
    | "bottom"
    | "left-top"
    | "right-top"
    | "left-bottom"
    | "right-bottom",
  event: PointerEvent,
) {
  if (state.maximized || state.minimized) return;

  const startX = event instanceof PointerEvent ? event.clientX : 0;
  const startY = event instanceof PointerEvent ? event.clientY : 0;

  const startWidth = state.width;
  const startHeight = state.height;
  const startPos = { ...position.value };

  boundaryBounding.update();
  const { left, top, right, bottom } = boundaryBounding;
  const onMove = (e: PointerEvent) => {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    let newWidth = startWidth;
    let newHeight = startHeight;
    let newX = startPos.x;
    let newY = startPos.y;

    if (type.includes("right")) {
      newWidth = startWidth + dx;
    }
    if (type.includes("left")) {
      newWidth = startWidth - dx;
      newX = startPos.x + dx;
    }
    if (type.includes("bottom")) {
      newHeight = startHeight + dy;
    }
    if (type.includes("top")) {
      newHeight = startHeight - dy;
      newY = startPos.y + dy;
    }

    if (newWidth < props.minWidth) {
      if (type.includes("left")) {
        newX -= props.minWidth - newWidth;
      }
      newWidth = props.minWidth;
    }

    if (newHeight < props.minHeight) {
      if (type.includes("top")) {
        newY -= props.minHeight - newHeight;
      }
      newHeight = props.minHeight;
    }

    // 边界约束
    if (newX < left.value + props.safeBoundary.left) {
      newWidth = newWidth - (left.value + props.safeBoundary.left - newX);
      newX = left.value + props.safeBoundary.left;
    }
    if (newX + newWidth > right.value - props.safeBoundary.right) {
      newWidth = right.value - props.safeBoundary.right - newX;
    }
    if (newY < top.value + props.safeBoundary.top) {
      newHeight = newHeight - (top.value + props.safeBoundary.top - newY);
      newY = top.value + props.safeBoundary.top;
    }
    if (newY + newHeight > bottom.value - props.safeBoundary.bottom) {
      newHeight = bottom.value - props.safeBoundary.bottom - newY;
    }

    state.width = newWidth;
    state.height = newHeight;
    position.value = { x: newX, y: newY };
  };

  const onUp = () => {
    document.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerup", onUp);
  };

  document.addEventListener("pointermove", onMove);
  document.addEventListener("pointerup", onUp, { once: true });
}

const onChangeWindow: InstanceType<typeof BaseFrame>["onWindow-change"] = (
  type,
) => {
  switch (type) {
    case "min":
      state.minimized = true;
      emits("minimize");
      break;
    case "scale":
      state.maximized = !state.maximized;
      state.minimized = false;
      emits("maximize");
      break;
    case "close":
      show.value = false;
      state.minimized = false;
      emits("close");
      break;
  }
};
</script>

<style lang="scss" scoped>
.base-window {
  &__frame {
    border-radius: 6px;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    border: 1px solid hsla(0, 0%, 100%, 0.3);
    box-shadow: 0 0 10px hsla(0, 0%, 0%, 0.5);
    overflow: hidden;
  }

  &__resize-bar {
    position: absolute;
    --bar-size: 6px;
    user-select: none;
    pointer-events: none;

    // 四边
    &.resize-bar__left-bar {
      cursor: ew-resize;
      left: calc(var(--bar-size) * -1 + 2px);
      width: var(--bar-size);
      top: 0;
      height: calc(100%);
    }
    &.resize-bar__right-bar {
      cursor: ew-resize;
      right: calc(var(--bar-size) * -1 + 2px);
      width: var(--bar-size);
      top: 0;
      height: calc(100%);
    }
    &.resize-bar__top-bar {
      cursor: ns-resize;
      top: calc(var(--bar-size) * -1 + 2px);
      height: var(--bar-size);
      left: 0;
      width: calc(100%);
    }
    &.resize-bar__bottom-bar {
      cursor: ns-resize;
      bottom: calc(var(--bar-size) * -1 + 2px);
      height: var(--bar-size);
      left: 0;
      width: calc(100%);
    }
    // 四角
    &.resize-bar__left-top-bar {
      cursor: nwse-resize;
      top: calc(var(--bar-size) * -1 + 2px);
      left: calc(var(--bar-size) * -1 + 2px);
      width: var(--bar-size);
      height: var(--bar-size);
    }
    &.resize-bar__right-top-bar {
      cursor: nesw-resize;
      top: calc(var(--bar-size) * -1 + 2px);
      right: calc(var(--bar-size) * -1 + 2px);
      width: var(--bar-size);
      height: var(--bar-size);
    }
    &.resize-bar__left-bottom-bar {
      cursor: nesw-resize;
      bottom: calc(var(--bar-size) * -1 + 2px);
      left: calc(var(--bar-size) * -1 + 2px);
      width: var(--bar-size);
      height: var(--bar-size);
    }
    &.resize-bar__right-bottom-bar {
      cursor: nwse-resize;
      bottom: calc(var(--bar-size) * -1 + 2px);
      right: calc(var(--bar-size) * -1 + 2px);
      width: var(--bar-size);
      height: var(--bar-size);
    }
  }
}

.base-window:not([data-maximized="true"]):not([data-minimized="true"]) {
  .base-window__resize-bar {
    pointer-events: all;
  }
}

:deep(.base-title-bar) {
  -webkit-app-region: no-drag;
}
</style>
