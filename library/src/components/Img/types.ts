import type { ThemeMode } from "@/theme";
import type { ImgHTMLAttributes } from "vue";

export interface ImgProps {
  /** 主题 */
  theme?: ThemeMode;
  /** 图片src */
  src?: string;
  /** 使用缩略图 @default false */
  useThumb?: boolean;
  /** 缩略图路径 @default "" */
  thumb?: string;
  /** 缩略图最大尺寸 (当启用缩略图但没有传入有效 `thumb` 时生效, 会尝试自动生成缩略图，并且生成尺寸由该值决定，默认`400px`,传入`number`类型) @default 400 */
  thumbMaxSize?: number;
  /** 当缩略图存在时，是否将其作为最终显示结果（不再请求原图）。(条件：必须在 useThumb 为 true 时生效) @default false	*/
  useThumbAsFinal?: boolean;
  /** 监听视口 (用于设定监听视口，用于图片懒加载) */
  viewport?: IntersectionObserverInit["root"];
  /** 监听视口的Margin */
  viewRootMargin?: IntersectionObserverInit["rootMargin"];
  /** 是否只监听一次 (默认：true) */
  observerOnce?: boolean;
  /** 手动控制 (图片加载成功后是否手动控制图片的显示，如果为true则在@loaded的回调函数中会携带show方法供外部调用) */
  manualControl?: boolean;
  /** 是否在初始状态（图片可能还未加载）就展示组件 @default false */
  initShow?: boolean;
  /** 是否允许拖拽图片 @default false */
  draggable?: boolean;
  /** img标签的 decoding 属性 */
  decoding?: ImgHTMLAttributes["decoding"];
  /** 显示加载动画 */
  showLoadingAnimation?: boolean;
}

// ? 图片准备成功后的信息
export type ReadyInfo = {
  meta: {
    valid: boolean;
    width: number;
    height: number;
    aspectRatio: number;
    [key: string]: any;
  };
  dom?: HTMLImageElement | null;
  load?: Function;
};
