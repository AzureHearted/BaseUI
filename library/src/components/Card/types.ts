import type { Property } from "csstype";

export interface CardProps {
  isSkeleton?: boolean;
  /** 卡片布局模式 */
  layout?: "absolute" | "default";
  /** 卡片阴影样式 */
  shadow?: Property.BoxShadow;
  /** 卡片鼠标悬浮阴影样式 */
  hoverShadow?: Property.BoxShadow;
}

export interface CardEmits {}
