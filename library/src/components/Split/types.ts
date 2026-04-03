import type { Property } from "csstype";
import type { StyleValue } from "vue";

export interface SplitProps {
  /** 是否垂直 */
  vertical?: boolean;
  /** 控制条宽度 (像素) @default 1 */
  resizeTriggerSize?: number;
  /** 控制条热区左右各扩展宽度 (像素) @default 2 */
  resizeTriggerHotAreaExtend?: number;
  /** 控制条悬浮后的扩展宽度 (像素) @default 0.5 */
  resizeTriggerHoverExtend?: number;

  /** 默认分割尺寸
   *  - 为 number 类型时应该为 0 ~ 1 之间的值，为 string 类型时应该为 ${number}px 格式
   *  @default 0.5
   */
  defaultSize?: string | number;
  /** 随容器缩放 */
  scaleWithContainer?: boolean;

  /** 基准 pane
   *  - 范围 1 ~ 2，1 为 first pane，2 为 second pane
   *  - 在容器尺寸变化时，被指定的 pane 尺寸将固定
   *  - 在容器尺寸变化时且没有有指定该值时，pane 1 和 pane 2 的尺寸随当前容器划分比例缩放
   *  @default undefined
   */
  basePane?: 1 | 2 | false;

  /** 基准区域允许的最小尺寸
   *  - 为 number 类型时应该为 0 ~ 1 之间的值，为 string 类型时应该为 ${number}px 格式
   *  @default undefined
   */
  baseMin?: string | number;

  /** 基准区域允许的最大尺寸
   *  - 为 number 类型时应该为 0 ~ 1 之间的值，为 string 类型时应该为 ${number}px 格式
   *  @default undefined
   */
  baseMax?: string | number;

  /** 另一个区域允许的最小尺寸
   *  - 为 number 类型时应该为 0 ~ 1 之间的值，为 string 类型时应该为 ${number}px 格式
   *  @default undefined
   */
  anotherMin?: string | number;

  /** 另一个区域允许的最大尺寸
   *  - 为 number 类型时应该为 0 ~ 1 之间的值，为 string 类型时应该为 ${number}px 格式
   *  @default undefined
   */
  anotherMax?: string | number;

  /** 每个区域允许的最小尺寸 (优先级低于base、another)
   *  - 为 number 类型时应该为 0 ~ 1 之间的值，为 string 类型时应该为 ${number}px 格式
   *  @default undefined
   */
  min?: string | number;

  /** 每个区域允许的最大尺寸 (优先级低于base、another)
   *  - 为 number 类型时应该为 0 ~ 1 之间的值，为 string 类型时应该为 ${number}px 格式
   *  @default undefined
   */
  max?: string | number;

  /** first 区域的样式 */
  pane1Style?: StyleValue;
  /** second 区域的样式 */
  pane2Style?: StyleValue;
  /** first 区域的 Overflow 样式 @default "auto" */
  pane1Overflow?: Property.Overflow;
  /** second 区域的 Overflow 样式 @default "auto" */
  pane2Overflow?: Property.Overflow;
  /** 控制条的颜色 @default hsl(228, 3%, 31%) */
  resizeTriggerColor?: Property.Color;
  /** 鼠标悬浮控制条时候的颜色 @default hsl(211, 58%, 49%) */
  resizeTriggerHoverColor?: Property.Color;
}
