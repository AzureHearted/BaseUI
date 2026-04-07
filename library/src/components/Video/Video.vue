<template>
  <div
    ref="containerDOM"
    class="base-video"
    :class="{
      'base-video--dark': isDark,
      'base-video__loading': !state.loaded,
      'base-video__show': state.show,
      'base-video__error': state.isError,
      'base-video__playing': playing,
    }"
  >
    <!-- ? 视频wrap -->
    <div
      ref="videoWrapRef"
      class="base-video__wrapper"
      v-bind="videoAttrs"
      v-lazy
    >
      <!-- ? 默认插槽 -->
      <slot>
        <!-- s 正常视频元素 -->
        <video
          v-if="mounted"
          ref="videoRef"
          :controls="showControls"
          :loop="loop"
          :autoplay="autoplay"
          :controlslist="controlslist"
          disable-picture-in-picture
          :draggable="draggable"
          :poster="useThumb ? thumb : ''"
        />
        <!-- s 加载错误时的显示元素 -->
        <div v-if="state.isError" class="base-video__error-img">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <path
              fill="currentColor"
              d="m12.195 12.902l1.951 1.952a.5.5 0 0 0 .708-.708l-13-13a.5.5 0 1 0-.708.708l1.739 1.738A2.5 2.5 0 0 0 2 5.5v5A2.5 2.5 0 0 0 4.5 13h7q.362-.001.695-.098M11.293 12H4.5A1.5 1.5 0 0 1 3 10.5v-5c0-.489.234-.923.596-1.197L6.5 7.207v2.972c0 .25.274.404.487.274l1.712-1.047zM8.74 6.619l1.677 1.677a.54.54 0 0 0-.171-.757zM13 10.5q0 .175-.039.34l.777.776A2.5 2.5 0 0 0 14 10.5v-5A2.5 2.5 0 0 0 11.5 3H5.121l1 1H11.5A1.5 1.5 0 0 1 13 5.5z"
            />
          </svg>
        </div>
      </slot>
      <!-- ? 播放图标 -->
      <div
        v-if="!state.isError && !playing"
        class="base-video__play-icon"
        @click="paly"
      >
        <icon-material-symbols-play-circle />
      </div>
    </div>
    <!-- 其他内容(插槽) -->
    <slot name="other"></slot>
  </div>
</template>

<script setup lang="ts">
// 导入工具函数
import {
  computed,
  inject,
  nextTick,
  onMounted,
  onUnmounted,
  useAttrs,
  useSlots,
  useTemplateRef,
} from "vue";
import { ref, reactive, watch } from "vue";
import type { Directive, ShallowRef } from "vue";
import { useElementHover, useMediaControls } from "@vueuse/core";
import type { ReadyInfo, VideoEmits, VideoProps } from "./types";
import { ThemeKey } from "@/theme";
import { resolveIsDark } from "@/utils/theme";

// 定义props
const props = withDefaults(defineProps<VideoProps>(), {
  src: "",
  useThumb: false,
  thumb: "",
  observerOnce: true,
  manualControl: false,
  draggable: true,
  initShow: false,
  show: true,
  muted: false,
  loop: false,
  autoplay: false,
  showControls: true,
  hoverPlay: false,
  hoverAnewStart: false,
});

// 定义事件
const emits = defineEmits<VideoEmits>();

// ? 用户传入的属性
const attrs = useAttrs();

// j 要传给video标签的属性
const videoAttrs = computed(() => {
  return attrs;
});

// ? 用户传入的插槽
const slots = useSlots();

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

// s 组件挂载标识符
const mounted = ref(false);

// s 组件挂载时执行
onMounted(() => {
  mounted.value = true;
  emits("mounted");
});

// s 组件容器DOM
const containerDOM = ref<HTMLElement | null>(null);

// w 监听传入的src变化,变化时立即重新加载
watch(
  () => props.src,
  (newSrc) => {
    // console.log("src变化", newSrc, oldSrc);
    if (mounted.value) {
      loadVideo(newSrc);
    }
  },
);

// s 定义状态
const state = reactive({
  isError: false,
  loaded: false,
  show: false,
});

// ? imgWrap的Ref
const videoWrapRef = useTemplateRef(
  "videoWrapRef",
) as ShallowRef<HTMLDivElement | null>;

// s imgWarp尺寸数据
const videoWrapDimensions = ref({ width: 0, height: 0 }); // ⬅️ 新的响应式依赖

// ? 监听器
let observer: ResizeObserver | null = null;

// ? 组件挂载时对imgWrap进行监听
onMounted(() => {
  if (videoWrapRef.value) {
    // 实例化 ResizeObserver
    observer = new ResizeObserver((entries) => {
      // 每次尺寸变化时，更新响应式数据
      const { width, height } = entries[0].contentRect;
      videoWrapDimensions.value = { width, height };
      if (!state.loaded || !state.show) {
        fixStyleBug();
      }
    });
    observer.observe(videoWrapRef.value);
    fixStyleBug();

    muted.value = props.muted;
  }
});

/**
 * * 修复与Fancyapps/ui 的 FancyBox 可能的冲突
 * 未知情况下 Fancyapps/ui 可能会将下面几个dom元素设置为 display:none
 */
function fixStyleBug() {
  requestAnimationFrame(() => {
    if (containerDOM.value) {
      containerDOM.value.style.display = "block";
    }
    if (videoWrapRef.value) {
      videoWrapRef.value.style.display = "block";
    }
    if (videoRef.value) {
      videoRef.value.style.display = "block";
    }
  });
}

// ? 当组件卸载时取消监听
onUnmounted(() => {
  observer?.disconnect();
});

// 定义video标签的ref
const videoRef = useTemplateRef(
  "videoRef",
) as ShallowRef<HTMLVideoElement | null>;

const { playing, muted, currentTime } = useMediaControls(videoRef, {
  src: props.src,
});

function paly() {
  playing.value = true;
}

// w 监听外部传入的是否显示变量 (如果不显示的时候就暂停)
watch(
  () => props.show,
  (show) => {
    if (!videoRef.value || props.hoverPlay) return;
    if (show) {
      // videoRef.value.play()
      playing.value = true;
    } else {
      // videoRef.value.pause()
      playing.value = false;
    }
  },
);

// w 监听muted变化
watch(
  () => props.muted,
  (newVal) => {
    if (videoRef.value) {
      muted.value = newVal;
    }
  },
);

// s 组件是否被鼠标悬浮
const isHover = useElementHover(containerDOM, {
  delayEnter: 500,
  delayLeave: 500,
});

// w 监听组件悬浮状态变化
watch(
  () => isHover.value,
  async (nowIsHover) => {
    await nextTick();
    if (!videoRef.value || !props.hoverPlay || props.autoplay) return;
    if (nowIsHover) {
      if (props.hoverAnewStart) {
        currentTime.value = 0;
        playing.value = true;
      } else {
        playing.value = true;
      }
    } else {
      playing.value = false;
    }
  },
);

// f 获取视频宽高
function getVideoSize(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.onloadedmetadata = function () {
      // 获取视频宽度和高度
      const width = video.videoWidth;
      const height = video.videoHeight;
      // 释放资源
      URL.revokeObjectURL(video.src);
      resolve({ width, height });
    };
    video.onerror = function () {
      reject("无法加载视频");
    };

    video.src = url;
    video.load();
  });
}

// f 加载
const loadVideo = async (src: string) => {
  // console.log('加载视频', src)
  // f 视频加载函数
  const handleLoad = () => {
    if (videoRef.value) {
      requestAnimationFrame(() => {
        state.loaded = true;
        state.show = true;
        state.isError = false;
      });

      /**
       * ! 由于Fancybox的一些特殊作用使用该组件可能会把这三个dom设置为display:none;
       * ? 因此手动设置 display
       */
      fixStyleBug();
    } else {
      state.loaded = true;
      state.show = true;
      state.isError = false;
    }
  };

  // 获取视频尺寸信息
  getVideoSize(src)
    .then(({ width, height }) => {
      // 对剩余的属性进行类型标注
      let info: ReadyInfo = {
        meta: {
          valid: true,
          ...state,
          width,
          height,
          aspectRatio: width / height, // 宽高比.
        },
      };

      // 判断是否需要用户手动加载
      if (!props.manualControl) {
        // 如果用户不需要手动加载就立即加载
        handleLoad();
        // 触发loaded事件
        emits("loaded", info);
        return;
      }

      // 返回dom和load函数
      info.load = handleLoad; // 如果需要手动加载就将该方法返回
      // 触发loaded事件,同时返回info对象
      emits("loaded", info);
    })
    .catch(() => {
      console.log("视频加载错误", src);
      state.isError = true;
      state.loaded = true;
      // 触发error事件
      emits("error");
    });
};

// 自定义指令
const vLazy: Directive = {
  mounted: () => {
    // 将任务放入宏队列(防止有些时候交叉检测失败的bug)
    setTimeout(() => {
      let src: string = props.src; // 默认使用传入src

      if (props.initShow) {
        loadVideo(src);
        return;
      }

      if (!!slots.default || !src) {
        // ? 用户向默认传入内容，则直接完成加载逻辑
        state.loaded = true;
        state.show = true;
        state.isError = !!slots.default ? false : !src;
        // ? 触发loaded事件,同时返回 info 对象
        emits("loaded", {
          meta: {
            aspectRatio: 0,
            height: 0,
            width: 0,
            valid: true,
          },
        });
        return;
      }

      const handleIntersection = async (
        entries: IntersectionObserverEntry[],
      ) => {
        // console.log(entries[0].isIntersecting);
        if (entries[0].isIntersecting) {
          // 判断是否只监听一次
          if (props.observerOnce) {
            // 停止监听
            observer.disconnect();
          }
          // 判断是否已经被加载过了
          if (state.loaded) {
            // 如果已经被加载就让其显示
            state.show = true;
            return;
          }

          if (props.useThumb && props.thumb) {
            state.loaded = true;
            state.show = true;
            state.isError = false;
          } else {
            // 执行加载函数
            loadVideo(src);
          }
        } else {
          state.show = false; // 标记为不可见
        }
      };

      // 配置 IntersectionObserver
      const options: IntersectionObserverInit = {
        root: props.viewport,
        rootMargin: props.viewRootMargin,
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      };

      // console.log(viewportDom.value);
      const observer = new IntersectionObserver(handleIntersection, options);
      // 开始监听
      if (containerDOM.value) {
        observer.observe(containerDOM.value);
      } else {
        // console.log('监听失效，未找到组件container')
      }
    }, 0);
  },
};
</script>

<style lang="scss" scoped>
.base-video {
  box-sizing: border-box; // 盒子模型，确保边框不会影响内容的大小。
  * {
    box-sizing: border-box;
  }
}

.base-video {
  &__wrapper {
    position: relative;
    & > video {
      // 默认不显示
      opacity: 0;
      visibility: hidden;
      transition:
        opacity 0.25s ease-out,
        visibility 0s linear 0s;
    }
    // 视频样式
    & > video {
      display: block !important;

      &:not([width]) {
        width: 100%;
      }
      &:not([height]) {
        height: auto;
      }
      // width: 100%;
      // height: auto;

      padding: 0;
      border: unset;
      outline: unset;
      object-fit: contain;
      background: transparent;
      // 禁止选中文字
      user-select: none;
      // 禁止图文拖拽
      -webkit-user-drag: none;
    }
  }

  // 加载完成且可见的样式
  &__show &__wrapper > video {
    opacity: 1;
    visibility: visible;
    transition:
      opacity 0.25s ease-in,
      visibility 0s linear 0s;
  }

  // 加载错误的样式
  &__error &__wrapper > video {
    display: none !important;
  }
}

/* 加载错误时候的图标样式 */
.base-video__error-img {
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    // width: 60%;
    // height: auto;
    fill: black;
    transition: 0.5s ease;
  }

  /** 暗黑模式样式 */
  .base-video--dark & > svg {
    fill: hsl(0, 0%, 80%);
  }
}

// s 播放按钮
.base-video__play-icon {
  position: absolute;
  display: flex;
  inset: 0;
  opacity: 0.75;
  background-repeat: no-repeat;
  /* pointer-events: none; */
  cursor: pointer;

  transition: 0.5s ease;
  & > svg {
    width: 100%;
    height: 100%;
    aspect-ratio: 1;
    color: palevioletred;
    transform: scale(0.5);
    /* backdrop-filter: blur(10px); */
    filter: drop-shadow(0 0 10px rgba(255, 255, 0, 0.5));
    transition: 0.5s ease;
  }
}

.base-video:hover .base-video__play-icon {
  opacity: 1;
  & > svg {
    filter: drop-shadow(0 0 20px rgba(255, 255, 0, 1));
  }
}
</style>
