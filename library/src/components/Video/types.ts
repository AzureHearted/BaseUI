import type { ThemeMode } from "@/theme";
import type { MediaHTMLAttributes } from "vue";

export interface VideoProps {
  /** 主题 */
  theme?: ThemeMode;
  /** 视频地址 */
  src: string;
  /** 是否使用缩略图  @default false */
  useThumb?: boolean;
  /** 缩略图地址 */
  thumb?: string;
  /** 监听视口 (用于设定监听视口，用于图片懒加载) */
  viewport?: IntersectionObserverInit["root"];
  /** 监听视口的Margin */
  viewRootMargin?: IntersectionObserverInit["rootMargin"];
  /** 是否只监听一次 @default true */
  observerOnce?: boolean;
  /** 是否手动控制加载 @default false */
  manualControl?: boolean;
  /** 是否可拖拽 @default true */
  draggable?: boolean;
  /** 是否在初始化后就立即显示 @default false */
  initShow?: boolean;
  /** 是否显示 @default true */
  show?: boolean;
  /** 是否静音 @default false */
  muted?: boolean;
  /** 是否循环播放 @default false */
  loop?: boolean;
  /** 是否在加载后自动播放  @default false */
  autoplay?: boolean;
  /** 是否显示视频控制栏 @default true */
  showControls?: boolean;
  /** video标签的controlslist属性 */
  controlslist?: MediaHTMLAttributes["controlslist"];
  /** 是否悬浮播放 (与autoplay不兼容,如果为 true 会忽视 autoplay) @default false */
  hoverPlay?: boolean;
  /** 是否在悬浮时从头播放 */
  hoverAnewStart?: boolean;
}

export interface VideoEmits {
  loaded: [info: ReadyInfo];
  mounted: [];
  error: [];
}

export type ReadyInfo = {
  meta: {
    valid: boolean;
    width: number;
    height: number;
    aspectRatio: number; // 宽高比
    [key: string]: any;
  };
  dom?: HTMLVideoElement;
  load?: Function;
};
