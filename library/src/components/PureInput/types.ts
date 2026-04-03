import type { ThemeMode } from "@/theme";
import type { SizeType } from "@/types";

export interface PureInputProps {
  /** 主题 */
  theme?: ThemeMode;
  /** 尺寸 */
  size?: SizeType;
  /** 可清空 */
  clearable?: boolean;
  /** 禁用 */
  disabled?: boolean;
  /** 圆角 */
  round?: boolean;
}
