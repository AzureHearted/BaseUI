import type { Property } from "csstype";

export interface GridProps {
  /**
   * 是否为 inline-grid
   */
  inline?: boolean;

  /** Grid 布局子元素的间距（等同 gap）*/
  gap?: Property.Gap<number | string>;

  /** 行间距 */
  rowGap?: Property.RowGap<number | string>;

  /** 列间距 */
  columnGap?: Property.ColumnGap<number | string>;

  /**
   * 列定义
   * 例：'1fr 1fr' | 'repeat(3, 1fr)'
   */
  columns?: Property.GridTemplateColumns;

  /** 列数 */
  cols?: number;

  /** 行定义 */
  rows?: Property.GridTemplateRows;

  /** 自动列 */
  autoColumns?: Property.GridAutoColumns;

  /** 自动行 */
  autoRows?: Property.GridAutoRows;

  /** 自动布局方向 */
  autoFlow?: Property.GridAutoFlow;

  /** 子元素水平对齐 */
  justifyItems?: Property.JustifyItems;

  /** 子元素垂直对齐*/
  alignItems?: Property.AlignItems;

  /** 整体水平对齐 */
  justifyContent?: Property.JustifyContent;

  /** 整体垂直对齐 */
  alignContent?: Property.AlignContent;

  /** 简写 place-items */
  placeItems?: Property.PlaceItems;

  /** 简写 place-content */
  placeContent?: Property.PlaceContent;

  /** 是否开启 dense（填补空隙）*/
  dense?: boolean;
}
