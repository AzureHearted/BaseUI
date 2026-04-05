<template>
  <div
    class="base-title-bar"
    :class="{
      'base-title-bar--dark': isDark,
    }"
  >
    <div class="base-title-bar__left">
      <slot name="left">
        {{ title }}
      </slot>
    </div>
    <div class="base-title-bar__middle">
      <slot name="middle"></slot>
    </div>
    <div class="base-title-bar__right">
      <div
        v-if="showMinButton"
        class="base-title-bar__button"
        @click="onChangeWindow('min')"
      >
        <svg
          t="1655259273075"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2803"
        >
          <path
            d="M810.666667 554.666667H213.333333c-25.6 0-42.666667-17.066667-42.666666-42.666667s17.066667-42.666667 42.666666-42.666667h597.333334c25.6 0 42.666667 17.066667 42.666666 42.666667s-17.066667 42.666667-42.666666 42.666667z"
            p-id="2804"
          ></path>
        </svg>
      </div>
      <div
        v-if="showMaxButton"
        class="base-title-bar__button"
        @click="onChangeWindow('scale')"
      >
        <svg
          v-if="isMax"
          t="1655259165159"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2427"
        >
          <path
            d="M768 170.666667h-341.333333c-46.933333 0-85.333333 38.4-85.333334 85.333333v85.333333H256c-46.933333 0-85.333333 38.4-85.333333 85.333334v341.333333c0 46.933333 38.4 85.333333 85.333333 85.333333h341.333333c46.933333 0 85.333333-38.4 85.333334-85.333333v-85.333333h85.333333c46.933333 0 85.333333-38.4 85.333333-85.333334V256c0-46.933333-38.4-85.333333-85.333333-85.333333zM256 768v-341.333333h341.333333v341.333333H256z m512-170.666667h-85.333333v-170.666666c0-46.933333-38.4-85.333333-85.333334-85.333334h-170.666666V256h341.333333v341.333333z"
            p-id="2428"
          ></path>
        </svg>
        <svg
          v-else
          t="1655259143272"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2224"
        >
          <path
            d="M768 170.666667H256c-46.933333 0-85.333333 38.4-85.333333 85.333333v512c0 46.933333 38.4 85.333333 85.333333 85.333333h512c46.933333 0 85.333333-38.4 85.333333-85.333333V256c0-46.933333-38.4-85.333333-85.333333-85.333333zM256 768V256h512v512H256z"
            p-id="2225"
          ></path>
        </svg>
      </div>
      <div
        v-if="showCloseButton"
        class="base-title-bar__button base-title-bar__close-button"
        @click="onChangeWindow('close')"
      >
        <svg
          t="1655259187200"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2630"
        >
          <path
            d="M571.733333 512l247.466667-247.466667c17.066667-17.066667 17.066667-42.666667 0-59.733333s-42.666667-17.066667-59.733333 0L512 452.266667 264.533333 204.8c-17.066667-17.066667-42.666667-17.066667-59.733333 0s-17.066667 42.666667 0 59.733333l247.466667 247.466667-247.466667 247.466667c-17.066667 17.066667-17.066667 42.666667 0 59.733333 8.533333 8.533333 21.333333 12.8 29.866667 12.8s21.333333-4.266667 29.866666-12.8l247.466667-247.466667 247.466667 247.466667c8.533333 8.533333 21.333333 12.8 29.866666 12.8s21.333333-4.266667 29.866667-12.8c17.066667-17.066667 17.066667-42.666667 0-59.733333L571.733333 512z"
            p-id="2631"
          ></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import type { TitleBarEmits, TitleBarProps } from "./types";
import { ThemeKey } from "@/theme";
import { resolveIsDark } from "@/utils/theme";

defineOptions({
  name: "BaseTitleBar",
});

const props = withDefaults(defineProps<TitleBarProps>(), {
  title: "新窗口",
  isMax: false,
  showMaxButton: true,
  showCloseButton: true,
  showMinButton: true,
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

const emits = defineEmits<TitleBarEmits>();

//放大缩小关闭
const onChangeWindow = (type: "min" | "scale" | "close"): void => {
  emits("onChangeWindow", type);
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.base-title-bar {
  display: flex;
  align-items: stretch;
  -webkit-app-region: drag;

  &__left,
  &__middle,
  &__right {
    height: 40px;
  }

  &__left {
    flex-grow: 1;
    flex-shrink: 0;

    display: flex;
    align-items: center;
    padding: 0 10px;
  }

  &__middle {
    display: flex;
    flex-wrap: nowrap;
  }

  &__right {
    flex-grow: 0;
    flex-shrink: 0;

    display: flex;
    flex-wrap: nowrap;
  }

  &__button {
    --fillColor: hsl(0, 0%, 0%);
    --bgHoverColor: hsl(0, 0%, 85%);

    width: 40px;
    aspect-ratio: 1;
    background-color: inherit;
    display: flex;
    align-items: center;
    padding: 8px;

    transition: background-color 0.25s;
    -webkit-app-region: no-drag;

    /* 亮色模式 */
    fill: var(--fillColor);
    &:hover {
      background-color: var(--bgHoverColor);
    }
    // 关闭按钮
    &.base-title-bar__close-button:hover {
      fill: rgb(255, 255, 255);
      background-color: hsl(355, 86%, 49%);
    }
  }

  /* 暗色模式 */
  &--dark &__button {
    --fillColor: hsl(0, 0%, 70%);
    --bgHoverColor: hsl(228, 3%, 32%);
  }
}
</style>
