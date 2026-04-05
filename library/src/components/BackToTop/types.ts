import type { ThemeMode } from "@/theme";

export interface BackToTopProps {
  theme?: ThemeMode;
  /** 滚动容器 (默认使用组件的容器) @default undefined */
  scrollContainer?: HTMLElement | null;
  /** 是否禁用 */
  disabled?: boolean;
  /** 显示回到顶部的滚动行为 @default "auto" */
  behavior?: ScrollBehavior;
}
