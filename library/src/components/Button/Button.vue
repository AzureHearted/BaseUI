<template>
  <button
    ref="buttonRef"
    class="base-button"
    :class="{
      [`base-button--${showType}`]: showType,
      [`base-button--${size}`]: size,
      'base-button--dark': isDark,
      'is-plain': plain,
      'is-round': round,
      'is-circle': circle,
      'is-disabled': disabled,
      'is-loading': loading,
    }"
    :disabled="disabled"
    @click="emitHandle('click', $event)"
    @dblclick="emitHandle('dblclick', $event)"
    @mousedown="emitHandle('mousedown', $event)"
    @mouseup="emitHandle('mouseup', $event)"
    @mouseenter="emitHandle('mouseenter', $event)"
    @mouseleave="emitHandle('mouseleave', $event)"
    @focus="emitHandle('focus', $event)"
    @blur="emitHandle('blur', $event)"
  >
    <!-- 图标 -->
    <Transition>
      <span
        class="base-button__icon"
        v-if="loading || (!loading && $slots['icon']?.())"
      >
        <div class="base-button__icon__slot base-button__loading-icon">
          <div class="base-button__icon__wrapper">
            <slot v-if="loading" name="loading-icon">
              <LoadingIcon />
            </slot>
            <slot v-else name="icon"> </slot>
          </div>
        </div>
      </span>
    </Transition>
    <!-- 内容区 -->
    <span class="base-button--content"> <slot></slot> </span>
  </button>
</template>

<script setup lang="ts">
import { watch, useTemplateRef, computed, inject, type Ref } from "vue";
import { useRipple } from "@/hooks";
import type { ButtonProps, ButtonEmits } from "./types";
import { resolveIsDark } from "@/utils/theme";
import { ThemeKey } from "@/theme";
import LoadingIcon from "../Icons/LoadingIcon/LoadingIcon.vue";

defineOptions({
  name: "BaseButton",
});

const props = withDefaults(defineProps<ButtonProps>(), {
  type: "primary",
  round: false,
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

// 要显示的按钮类型
const showType = computed(() => {
  if (!props.loading) {
    return props.type;
  } else {
    return props.loadingType || props.type;
  }
});

const emit = defineEmits<ButtonEmits>();

// f 事件执行函数
function emitHandle<K extends keyof ButtonEmits>(
  type: K,
  e: ButtonEmits[K][0],
) {
  if (props.disabled) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  if (type === "click") {
    // 点击的情况
    if (props.loading) {
      emit("loadingClick", e as MouseEvent);
    } else {
      emit("click", e as MouseEvent);
    }
  } else {
    emit(type as any, e);
  }
}

const buttonRef = useTemplateRef("buttonRef") as Ref<HTMLElement | null>;

const { disable: disableRipple } = useRipple(buttonRef, {
  allowChildTrigger: true,
});

watch(
  () => props.disabled,
  (val) => (disableRipple.value = val),
  { immediate: true },
);
</script>

<style lang="scss" scoped>
// ? 去除默认样式
button.base-button {
  background: none;
  border: none;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

// ? 变量
button.base-button {
  --font-size: 16px;
  --height: 34px;
  --padding-size: 14px;
  --icon-size: 18px;
  --border-radius: 6px;

  &--tiny {
    --font-size: 12px;
    --height: 22px;
    --padding-size: 8px;
    --icon-size: 16px;
    --border-radius: 4px;
  }

  &--small {
    --font-size: 14px;
    --height: 28px;
    --padding-size: 12px;
    --icon-size: 16px;
    --border-radius: 5px;
  }

  &--large {
    --font-size: 15px;
    --height: 40px;
    --padding-size: 18px;
    --icon-size: 20px;
    --border-radius: 8px;
  }
}

// 自定义样式
button.base-button {
  position: relative;
  border-radius: var(--border-radius);
  white-space: nowrap;
  text-align: center;
  color: getThemeColor(dark, text);
  overflow: hidden;
  user-select: none;
  cursor: pointer;

  // 字体大小
  font-size: var(--font-size);
  // 高度
  height: var(--height);
  // 行高
  line-height: var(--height);
  // 内边距
  padding: 0 var(--padding-size);

  transition: 0.5s ease;
  transition-property: background-color, border-color, color;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;

  &--primary {
    color: getThemeColor(light, primary-text);
    background-color: getThemeColor(light, primary);
    border: 1px solid getThemeColor(light, primary);
    &:hover:not([disabled]) {
      background-color: getThemeColor(light, primary-hover);
    }
  }

  &--secondary {
    color: getThemeColor(light, secondary-text);
    background-color: getThemeColor(light, secondary);
    border: 1px solid getThemeColor(light, secondary);
    &:hover:not([disabled]) {
      background-color: getThemeColor(light, secondary-hover);
    }
  }

  &--success {
    color: getThemeColor(light, success-text);
    background-color: getThemeColor(light, success);
    border: 1px solid getThemeColor(light, success);
    &:hover:not([disabled]) {
      background-color: getThemeColor(light, success-hover);
    }
  }

  &--info {
    color: getThemeColor(light, info-text);
    background-color: getThemeColor(light, info);
    border: 1px solid getThemeColor(light, info);
    &:hover:not([disabled]) {
      background-color: getThemeColor(light, info-hover);
    }
  }

  &--help {
    color: getThemeColor(light, help-text);
    background-color: getThemeColor(light, help);
    border: 1px solid getThemeColor(light, help);
    &:hover:not([disabled]) {
      background-color: getThemeColor(light, help-hover);
    }
  }

  &--warning {
    color: getThemeColor(light, warning-text);
    background-color: getThemeColor(light, warning);
    border: 1px solid getThemeColor(light, warning);
    &:hover:not([disabled]) {
      background-color: getThemeColor(light, warning-hover);
    }
  }

  &--danger {
    color: getThemeColor(light, danger-text);
    background-color: getThemeColor(light, danger);
    border: 1px solid getThemeColor(light, danger);
    &:hover:not([disabled]) {
      background-color: getThemeColor(light, danger-hover);
    }
  }

  // 圆角
  &.is-round {
    border-radius: var(--height);
  }

  // 禁用状态
  &.is-disabled {
    cursor: not-allowed;
    opacity: 0.38;
  }

  // 加载状态
  // &.is-loading {
  //   cursor: wait;
  // }

  // ? 图标样式
  .base-button__icon {
    height: var(--icon-size);
    width: var(--icon-size);
    max-width: var(--icon-size);
    font-size: var(--icon-size);
    flex-shrink: 0;
    margin-right: 6px;
    position: relative;

    // 图标插槽样式
    .base-button__icon__slot {
      height: var(--icon-size);
      width: var(--icon-size);

      // 图标容器样式
      .base-button__icon__wrapper {
        height: var(--icon-size);
        aspect-ratio: 1;

        display: flex;
        align-items: center;

        // 图标内svg样式
        svg {
          width: 1em;
          height: 1em;
        }
      }

      // 加载图标的样式
      .base-button__loading-icon {
        /* 加载动画 */
        .base-button__icon__wrapper {
          animation: rotator 1s linear infinite both;
        }
      }
    }
  }

  // 过渡效果
  .v-enter-active,
  .v-leave-active {
    transition: all 0.5s ease;
  }

  .v-enter-from,
  .v-leave-to {
    --icon-size: 0;
    margin: 0;
    opacity: 0;
    * {
      transition: inherit;
    }
  }
}

// 暗色主题
button.base-button--dark.base-button {
  // &--default {
  //   color: getThemeColor(dark, text);
  //   border: 1px solid getThemeColor(dark, text);
  //   background-color: getThemeColor(dark, default);
  //   &:hover:not([disabled]) {
  //     background-color: getThemeColor(dark, default-hover);
  //   }
  // }

  &--primary {
    color: getThemeColor(dark, primary-text);
    background-color: getThemeColor(dark, primary);
    border: 1px solid getThemeColor(dark, primary);
    &:hover:not([disabled]) {
      background-color: getThemeColor(dark, primary-hover);
    }
  }

  &--secondary {
    color: getThemeColor(dark, secondary-text);
    background-color: getThemeColor(dark, secondary);
    border: 1px solid getThemeColor(dark, secondary);
    &:hover:not([disabled]) {
      background-color: getThemeColor(dark, secondary-hover);
    }
  }

  &--success {
    color: getThemeColor(dark, success-text);
    background-color: getThemeColor(dark, success);
    border: 1px solid getThemeColor(dark, success);
    &:hover:not([disabled]) {
      background-color: getThemeColor(dark, success-hover);
    }
  }

  &--info {
    color: getThemeColor(dark, info-text);
    background-color: getThemeColor(dark, info);
    border: 1px solid getThemeColor(dark, info);
    &:hover:not([disabled]) {
      background-color: getThemeColor(dark, info-hover);
    }
  }

  &--help {
    color: getThemeColor(dark, help-text);
    background-color: getThemeColor(dark, help);
    border: 1px solid getThemeColor(dark, help);
    &:hover:not([disabled]) {
      background-color: getThemeColor(dark, help-hover);
    }
  }

  &--warning {
    color: getThemeColor(dark, warning-text);
    background-color: getThemeColor(dark, warning);
    border: 1px solid getThemeColor(dark, warning);
    &:hover:not([disabled]) {
      background-color: getThemeColor(dark, warning-hover);
    }
  }

  &--danger {
    color: getThemeColor(dark, danger-text);
    background-color: getThemeColor(dark, danger);
    border: 1px solid getThemeColor(dark, danger);
    &:hover:not([disabled]) {
      background-color: getThemeColor(dark, danger-hover);
    }
  }
}

/* 旋转动画 */
@keyframes rotator {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
