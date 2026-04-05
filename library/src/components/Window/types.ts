import type { ThemeMode } from "@/theme";
import type { MaybeComputedElementRef } from "@vueuse/core";
import { extend } from "hammerjs";
import type { HTMLAttributes } from "vue";

export interface WindowProps extends Omit<FrameProps, "isMax"> {
  /** 边界容器 (如果不传入则默认使用窗口尺寸)  */
  boundaryContainer?: MaybeComputedElementRef;
  /** 初始窗口宽度 @default 500 */
  initWidth?: number;
  /** 初始窗口高度 @default 400 */
  initHeight?: number;
  /** 最小宽度 @default 200 */
  minWidth?: number;
  /** 最小高度 @default 120 */
  minHeight?: number;
  /** 安全边界
   * @default
   * { left: 4, top: 4, right: 4, bottom: 4 } */
  safeBoundary?: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
}

export interface WindowEmits {
  close: [];
  maximize: [];
  minimize: [];
}

export interface FrameProps extends Omit<TitleBarProps, "theme"> {
  /** @default true */
  showTitleBar?: boolean;
  /** 是否是最大化状态 @default false */
  isMax?: boolean;
  /** 内容区样式 */
  contentStyle?: HTMLAttributes["style"];
  /** 内容区类名 */
  contentClass?: HTMLAttributes["class"];
}

export interface FrameEmits {
  "window-change": [type: "min" | "scale" | "close"];
  "titlebar-click": [e: MouseEvent];
  "titlebar-dblclick": [e: MouseEvent];
}

export interface TitleBarProps {
  theme?: ThemeMode;
  /** 标题 */
  title?: string;
  /** 是否是最大化状态 @default false */
  isMax?: boolean;
  /** 显示最大化按钮 @default true */
  showMaxButton?: boolean;
  /** 显示关闭按钮 @default true */
  showCloseButton?: boolean;
  /** 显示最小化按钮 @default true */
  showMinButton?: boolean;
}

export interface TitleBarEmits {
  onChangeWindow: [type: "min" | "scale" | "close"];
}
