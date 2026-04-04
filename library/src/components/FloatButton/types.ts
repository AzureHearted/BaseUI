import type { TapEvent } from "@/hooks";
import type { ThemeMode } from "@/theme";
import type { MaybeComputedElementRef } from "@vueuse/core";

export interface FloatButtonProps {
  theme: ThemeMode;
  /** 边界容器 (如果不传入则默认使用窗口尺寸)  */
  boundaryContainer?: MaybeComputedElementRef;
  /** 初始位置 (相对于右下角定位)
   * @default
   * { right: 10, bottom: 20 }  */
  initPosition?: {
    right: number;
    bottom: number;
  };
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

export interface FloatButtonEmits {
  "main-button-click": [e?: MouseEvent];
  "main-button-dblclick": [e?: TapEvent];
}
