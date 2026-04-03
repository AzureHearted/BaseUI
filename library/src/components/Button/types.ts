import type { ThemeMode } from "@/theme";
import type { ColorType, SizeType } from "@/types";

export type ButtonType = ColorType;
export type ButtonSize = SizeType;

export interface ButtonProps {
  theme?: ThemeMode;
  type?: ButtonType;
  size?: ButtonSize;
  plain?: boolean;
  round?: boolean;
  circle?: boolean;
  disabled?: boolean;
  loading?: boolean;
  /** loading 时的类型 */
  loadingType?: ButtonType;
}

export interface ButtonEmits {
  click: [e: MouseEvent];
  loadingClick: [e: MouseEvent]; // loading 过程中点击
  dblclick: [e: MouseEvent];
  mousedown: [e: MouseEvent];
  mouseup: [e: MouseEvent];
  mouseenter: [e: MouseEvent];
  mouseleave: [e: MouseEvent];
  focus: [e: FocusEvent];
  blur: [e: FocusEvent];
}
