import type { ThemeMode } from "@/theme";
import type { HTMLAttributes, VNode } from "vue";

export interface TabsProps {
  theme?: ThemeMode;
  /** Tab `内容区` 的 `Style` */
  contentStyle?: HTMLAttributes["style"];
  /** 显示 Tab `切换按钮` @default false */
  showButtons?: boolean;
}

export interface TabsEmits {
  change: [name: string];
}

export interface TabPaneProps {
  /** tab 名称 (唯一值) */
  name: string;
  /** 顺序 (唯一值) */
  order?: number;
  /** tab 标签 */
  label?: string;
}

// t 未注册的tab数据
export interface TabItem {
  /** tab 名称 (唯一值) */
  name: string;
  /** tab 标签 */
  label: string;
  /** 顺序 (唯一值) */
  order: number;
}

// t 已注册的Tab数据
export interface TabItemRegistered extends TabItem {
  id: string; // 注册后创建一个唯一id
  // 默认插槽的VNodes
  defaultVNodes: {
    render: () => VNode | VNode[];
  };
  // label插槽的VNodes
  labelVNodes: {
    render: () => VNode | VNode[];
  };
}
