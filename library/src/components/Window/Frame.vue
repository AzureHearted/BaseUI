<template>
  <div ref="containerRef" class="base-frame">
    <!-- 标题栏 -->
    <div class="base-frame__title" v-if="showTitleBar">
      <slot name="title-bar">
        <TitleBar
          ref="titleBarRef"
          :title="title"
          :isMax="isMax"
          :show-max-button="showMaxButton"
          :show-close-button="showCloseButton"
          :show-min-button="showMinButton"
          @dblclick.stop="$emit('titlebar-dblclick', $event)"
          @click.stop="$emit('titlebar-click', $event)"
          @on-change-window="onChangeWindow"
        >
          <template #left>
            <slot name="title-bar-left" :is-dark="isDark"> </slot>
          </template>
          <template #middle>
            <slot name="title-bar-middle" :is-dark="isDark"> </slot>
          </template>
        </TitleBar>
      </slot>
    </div>
    <!-- 内容区 -->
    <div
      ref="contentRef"
      class="base-frame__content"
      :style="[contentStyle]"
      :class="[contentClass]"
    >
      <slot name="default" :is-dark="isDark"> </slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import TitleBar from "./TitleBar.vue";
import { usePreferredDark } from "@vueuse/core";
import { useTemplateRef } from "vue";
import type { ShallowRef } from "vue";
import type { FrameEmits, FrameProps } from "./types";

defineOptions({
  name: "BaseFrame",
});

withDefaults(defineProps<FrameProps>(), {
  showTitleBar: true,
  title: "窗口",
  showMaxButton: true,
  showCloseButton: true,
  showMinButton: true,
});

const isDark = usePreferredDark();

const titleBarRef = useTemplateRef("titleBarRef") as ShallowRef<
  InstanceType<typeof TitleBar>
>;

const emits = defineEmits<FrameEmits>();

function onChangeWindow(type: "min" | "scale" | "close"): void {
  emits("window-change", type);
}

// 暴露属性给父组件
defineExpose({
  titleBarRef,
});
</script>

<style scoped lang="scss">
* {
  box-sizing: border-box;
}

// s 框架
.base-frame {
  display: flex;
  flex-flow: column nowrap;
  width: 100vw;
  height: 100vh;
  transition: unset;

  &__content {
    flex-grow: 1;
    overflow: auto;
    transition: unset;
  }
}

:deep(.base-title-bar__left) {
  user-select: none;
}
</style>
