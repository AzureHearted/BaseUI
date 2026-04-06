<template>
  <div
    class="base-input"
    :class="{
      [`base-input--${size}`]: size,
      'base-input--dark': isDark,
      'is-disabled': disabled,
      'is-round': round,
    }"
  >
    <div class="base-input__wrapper">
      <!-- prefix -->
      <div class="base-input__prefix">
        <slot name="prefix" :isDark="isDark" />
      </div>

      <!-- 核心：input 由外部传入 -->
      <div class="base-input__inner">
        <slot :isDark="isDark" />
      </div>

      <!-- suffix -->
      <div class="base-input__suffix">
        <slot name="suffix" :isDark="isDark" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ThemeKey } from "@/theme";
import { resolveIsDark } from "@/utils/theme";
import { computed, inject } from "vue";
import type { PureInputProps } from "./types";

const props = withDefaults(defineProps<PureInputProps>(), {});

// 主题上下文注入
const themeContext = inject(ThemeKey, null);

// 主题模式
const themeMode = computed(() => props?.theme ?? "system");

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
@use "./style.scss" as *;

// 变量
.base-input {
  @include base-input-size-variables(medium);

  &--tiny {
    @include base-input-size-variables(tiny);
  }

  &--small {
    @include base-input-size-variables(small);
  }

  &--large {
    @include base-input-size-variables(large);
  }

  @include base-input-theme-variables(light);
  &--dark {
    @include base-input-theme-variables(dark);
  }

  --background-focus-color: rgba(99, 226, 183, 0.2);
}

.base-input {
  font-size: var(--font-size);

  &__wrapper {
    display: flex;
    width: 100%;

    padding: 0px var(--padding-size);
    border-radius: 4px;
    background-color: var(--background-color);

    border: var(--border);
    transition: 0.3s;
    &:hover {
      border-color: var(--border-hover-color);
    }
  }

  &.is-round &__wrapper {
    border-radius: var(--height);
  }

  &__inner {
    flex: 1;

    input {
      width: 100%;
      min-width: 0;
      font-size: var(--font-size);
      color: var(--text-color);
      height: var(--height);
      line-height: var(--height);
    }
  }

  &__prefix,
  &__suffix {
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }

  &__prefix {
    margin-right: 4px;
    &:empty {
      margin-right: 0;
    }
  }

  &__suffix {
    margin-left: 4px;
    &:empty {
      margin-left: 0;
    }
  }

  &:focus-within {
    .base-input__wrapper {
      border-color: var(--border-hover-color);
      background-color: var(--background-focus-color);
    }
  }
}
</style>
