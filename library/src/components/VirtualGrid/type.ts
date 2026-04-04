export interface VirtualGridProps {
  /** 数据列表 */
  items: Item[];
  /** gap 布局间隔 @default 5 */
  gap?: number;
  /** 列数 */
  columns?: number;
  /**
   * 断点 (响应式列数)
   * - 若传入该属性列数将依据 `columns` 属性
   * @example
   * {
   *	 '0': 1,	// 0px及以上：1列
   *	 '320': 2,	// 320px及以上：2列
   *	 '480': 3,	// 480px及以上：3列
   *	 '768': 4,	// 768px及以上：4列
   *	 '1024': 5,	// 1024px及以上：5列
   *	 '1200': 6,	// 1200px及以上：6列
   *	 '1440': 7,	// 1440px及以上：7列
   *	}
   */
  breakpoints?: Record<string, number>;
  /** 滚动容器 (默认使用组件的容器) @default undefined */
  scrollContainer?: HTMLElement | null;
  /** item 使用过度效果 (开启过渡后可能存在性能问题) @default false */
  allowItemTransition?: boolean;
}

// t 数据定义
export interface Item {
  id: string;
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
