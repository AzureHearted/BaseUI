import type { Property } from "csstype";

export interface FlexProps {
  /** Flex 布局方向 */
  direction?: Property.FlexDirection;
  /** Flex 布局主轴对齐方式 */
  justify?: Property.JustifyContent;
  /** Flex 布局交叉轴对齐方式 */
  align?: Property.AlignItems;
  /** Flex 布局换行  */
  wrap?: Property.FlexWrap;
  /** Flex 布局子元素的间距 */
  gap?: number;
}
