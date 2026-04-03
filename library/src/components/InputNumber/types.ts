import type { PureInputProps } from "../PureInput/types";

export interface InputNumberProps extends PureInputProps {
  /** 类型 */
  placeholder?: string;
  /** 只读 */
  readonly?: boolean;
  /** 最小值 */
  min?: number;
  /** 最大值 */
  max?: number;
  /** 步长  @default 1*/
  step?: number;
}
