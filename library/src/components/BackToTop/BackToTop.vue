<template>
  <transition name="back-top">
    <div
      class="base-back-to-top"
      :class="{
        'base-back-to-top--dark': isDark,
      }"
      v-show="bakctopShow && !disabled"
      @click.stop="backToTop"
    >
      <i class="base-back-to-top__icon">
        <svg viewBox="0 0 1024 1024" width="1.2em" height="1.2em">
          <path fill="currentColor" d="M512 320L192 704h639.936z"></path>
        </svg>
      </i>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, inject, nextTick, onMounted, reactive, watch } from "vue";
import type { BackToTopProps } from "./types";
import { useScroll } from "@vueuse/core";
import { ThemeKey } from "@/theme";
import { resolveIsDark } from "@/utils/theme";

const props = withDefaults(defineProps<BackToTopProps>(), {
  behavior: "smooth",
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

// j 滚动容器的DOM
const scrollContainerDOM = computed(() => {
  return props.scrollContainer;
});

// s 状态数据
const state = reactive({
  scrollState: useScroll(scrollContainerDOM.value),
});

// j backTop 回到顶部按钮的显示状态
const bakctopShow = computed<Boolean>(() => {
  return scrollContainerDOM.value != null && state.scrollState.y > 20;
});

// w 组件挂载时进行初始化
onMounted(() => {
  init();
});

// f 初始化
async function init() {
  await nextTick();

  if (!scrollContainerDOM.value) return;

  // ? 组件挂载后重新绑定滚动容器 (因为挂载前可能传入scrollContainer还未挂载)
  bindingScrollContainer(scrollContainerDOM.value);

  // ? 如果滚动容器变化时则需要重新绑定监听
  watch(scrollContainerDOM, (dom, oldDOM) => {
    if (dom === oldDOM) return;
    if (!dom) return;
    const oldScrollState = state.scrollState;
    bindingScrollContainer(dom);
    state.scrollState.x = oldScrollState.x;
    state.scrollState.y = oldScrollState.y;
  });
}

// f 绑定滚动容器
function bindingScrollContainer(scrollContainer: HTMLElement | null) {
  state.scrollState = reactive(useScroll(scrollContainer));
}

// f 执行回到顶部
function backToTop() {
  requestAnimationFrame(() =>
    scrollContainerDOM.value?.scrollTo({
      top: 0,
      behavior: props.behavior,
    }),
  );
}
</script>

<style lang="scss" scoped>
// s 返回顶部按钮样式
.base-back-to-top {
  & {
    --color: #409eff;
    --bg-color: #eee;
    --hover-bg-color: #d0e3ff;
    --box-shadow: 0px 0px 6px #d0e3ff;

    position: absolute;
    width: 40px;
    height: 40px;

    right: 40px;
    bottom: 40px;

    border-radius: 50%;
    color: var(--color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: var(--box-shadow);
    cursor: pointer;
    z-index: 5;
    background-color: var(--bg-color);

    transition: 0.5s ease;

    &:hover {
      background-color: var(--hover-bg-color);
    }

    .base-back-to-top__icon {
      height: 1em;
      width: 1em;
      line-height: 1em;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      position: relative;
      fill: currentColor;
      color: var(--color);
      font-size: inherit;
    }
  }

  &--dark {
    /** 暗黑模式样式 */
    --color: #eee;
    --bg-color: #409eff;
    --hover-bg-color: #53a8ff;
    --box-shadow: 0px 0px 6px #53a8ff;
  }
}

// z back-top按钮进入和退出时的过渡
.back-top-enter-active {
  transition: opacity 0.3s;
}

.back-top-leave-active {
  transition: opacity 0.3s ease 0.5s;
}

.back-top-enter-from,
.back-top-leave-to {
  opacity: 0;
}
</style>
