import type { PureInputProps } from "../PureInput/types";

export type InputType = "text" | "password";

export interface InputProps extends PureInputProps {
  /** 类型 */
  type?: InputType;
  placeholder?: string;
  /** 只读 */
  readonly?: boolean;
}
