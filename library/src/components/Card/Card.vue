<template>
  <div
    ref="containerRef"
    class="base-card"
    :class="{
      'base-card--layout-absolute': layout === 'absolute',
    }"
    tabindex="0"
  >
    <!-- ? 卡片header -->
    <div class="base-card__header">
      <slot name="header"></slot>
    </div>
    <!-- ? 卡片内容区 -->
    <div class="base-card__content">
      <slot v-if="!isSkeleton" name="default">
        <!-- ? 默认插槽：BaseImg组件 -->
      </slot>
      <slot v-else name="skeleton"> </slot>
    </div>
    <!-- ? 卡片footer -->
    <div class="base-card__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CardEmits, CardProps } from "./types";

// ? 定义props
withDefaults(defineProps<CardProps>(), {
  layout: "absolute",
  shadow: "0 0 4px 0 rgba(0, 0, 0, 0.5)",
  hoverShadow: "0 0 10px 0 rgba(0, 0, 0, 1)",
});

// ? 定义emits
const emits = defineEmits<CardEmits>();
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
// 容器基础样式
.base-card {
  position: relative;
  display: flex;
  flex-flow: column;
  box-shadow: v-bind("$props.shadow");
  transition: box-shadow 0.5s;

  &:focus {
    outline: none;
  }

  &:hover {
    box-shadow: v-bind("$props.hoverShadow");
  }

  &__content {
    /* flex-grow: 1; */
    flex-shrink: 0;
  }

  &__header {
    position: relative;
    z-index: 1;

    pointer-events: none;
    * {
      pointer-events: auto;
    }
  }
  .base-card__footer {
    position: relative;

    pointer-events: none;
    * {
      pointer-events: auto;
    }
  }

  &--layout-absolute {
    .base-card__header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }

    .base-card__footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
}
</style>
