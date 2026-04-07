import type { ThemeMode } from "@/theme";

export interface ContextMenuOption<T = any> {
  /** 菜单标签  */
  label: string;
  /** 菜单命令 */
  command: T;
  /** 禁用 @default false */
  disable?: boolean;
  /** 隐藏 @default false */
  hidden?: boolean;
}

export interface ContextMenuProps {
  theme?: ThemeMode;
  /** 字体大小 @default 14 */
  fontSize?: number;
}

export interface ContextMenuEmits {
  show: [];
  closed: [];
}
