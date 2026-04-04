export interface VirtualJustifiedProps {
  /** 数据列表 */
  items: Item[];
  /** gap 布局间隔 @default 5 */
  gap?: number;
  /** 目标行高 */
  targetRowHeight?: number;
  /** 是否强制铺满最后一行 */
  lastRowFill?: boolean;
  /** 滚动容器 (默认使用组件的容器) @default undefined */
  scrollContainer?: HTMLElement | null;
  /** item 使用过度效果 (开启过渡后可能存在性能问题) @default false */
  allowItemTransition?: boolean;
}

// t 数据定义
export interface Item {
  id: string;
  aspectRatio: number;
  [key: string]: any;
}

// t 位置类型
export interface Pos {
  id: string;
  realIndex: number;
  left: number;
  top: number;
  width: number;
  height: number;
}
