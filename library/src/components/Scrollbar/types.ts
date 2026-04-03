import type { TeleportProps, HTMLAttributes } from "vue";
import type { Property } from "csstype";

export interface ScrollbarProps {
  /** value 绑定值，可以是百分比或像素值，取决于 model-mode @default 'px' */
  valueMode?: "percent" | "px";
  /** 禁用虚拟滚动条（改用原生滚动条） @default false */
  disable?: boolean;
  /** 垂直方向的 overflow @default "auto" */
  overflowY?: Property.OverflowY;
  /** 水平方向的 overflow @default "auto" */
  overflowX?: Property.OverflowX;
  /** 显示滚动条 @default true */
  showScrollbar?: boolean;
  /** 显示回到顶部按钮？  @default false */
  showBackTopButton?: boolean;
  /** 显示回到顶部的滚动行为 @default "auto" */
  backToTopBehavior?: ScrollBehavior;
  /** 滚动条的track尺寸（宽度） @default 12 */
  trackSize?: number;
  /** 滚动条的track的padding尺寸（宽度）会影响thumb的视觉尺寸 @default 2 */
  thumbPadding?: number;
  /** 鼠标悬浮在track上时padding尺寸（宽度）会影响thumb的视觉尺寸 @default 0 */
  hoverThumbPadding?: number;
  /** 滚动条偏移量 [ `垂直滚动条的横向偏移`px , `水平滚动条的纵向偏移`px ] @default [1,1] */
  offset?: [number, number];
  /** 将滚动条传送到指定元素 @default false */
  teleportTo?: TeleportProps["to"] | false;
  /** 视口样式，为防止计算出错请勿设置 padding 和 margin  */
  viewportStyle?: HTMLAttributes["style"];
  /** 显示抵达指示器 @default false */
  showArrivedIndicator?: boolean;
}
