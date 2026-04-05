<template>
  <div
    class="base-block-ui"
    :class="{
      'base-block-ui--dark': isDark,
      'base-block-ui__blocked': blocked,
    }"
  >
    <!-- 内容出口 -->
    <slot></slot>
    <div class="base-block-ui__mask"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import type { BlockUIProps } from "./types";
import { ThemeKey } from "@/theme";
import { resolveIsDark } from "@/utils/theme";

defineOptions({
  name: "BaseBlockUI",
});

const props = withDefaults(defineProps<BlockUIProps>(), {
  blocked: false,
});

// 主题上下文注入
const themeContext = inject(ThemeKey, null);

// 主题模式
const themeMode = computed(() => props.theme ?? "system");

// 主题模式优先级：组件 prop > provider > system
const isDark = computed(() => {
  if (props.theme) {
    return resolveIsDark(themeMode.value);
  }

  if (themeContext) {
    return themeContext.isDark.value;
  }

  return resolveIsDark("system");
});
</script>

<style lang="scss" scoped>
.base-block-ui {
  position: relative;

  /* 亮色主题 */
  --blockedMaskColor: rgba(0, 0, 0, 0.4);

  /* 暗黑主题 */
  &--dark {
    --blockedMaskColor: rgba(0, 0, 0, 0.6);
  }

  &__mask {
    position: absolute;
    inset: 0;
    background-color: unset;
    pointer-events: none;
    transition: background-color 0.5s ease;
  }

  &__blocked > &__mask {
    pointer-events: unset;
    background-color: var(--blockedMaskColor);
  }
}
</style>
