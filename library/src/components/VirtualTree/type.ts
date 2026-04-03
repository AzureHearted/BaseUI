import type { ThemeMode } from "@/theme";

export interface VirtualTreeProps {
  /** 数据列表 */
  data: Array<TreeNodeItem>;
  /** 是否允许拖拽节点 */
  allowDrag?: boolean;
  /** 允许删除节点 */
  allowDeleteNode?: boolean;
  /** 允许增加节点 */
  allowAddNode?: boolean;
  /** 多选模式 */
  multipleSelect?: boolean;
  /** 关键词过滤 */
  keywords?: string;
  /** 仅高亮筛选 (开启后将不会隐藏无关节点) @default false */
  hightlightFilterOnly?: boolean;
  /** 滚动容器 (默认使用组件的容器) @default undefined */
  scrollContainer?: HTMLElement | null;
  /** item 高度 @default 28 */
  itemHeight?: number;
  /**
   * 请求节点函数
   * @param node 目标节点
   * @returns 子节点列表
   */
  requestChildren?: (
    node: TreeNodeItem,
  ) => Promise<TreeNodeItem[] | null> | TreeNodeItem[] | null;
  /**
   * 添加节点函数
   * @param targetNode 目标节点
   * @param parentNode 父节点
   * @returns 新增节点数据
   */
  addNode?: (
    targetNode: TreeNodeItem,
    parentNode: TreeNodeItem | null,
  ) => Promise<TreeNodeItem | null> | TreeNodeItem | null;
  /**
   * 删除节点函数
   * @param node 节点对象
   * @returns 根据返回值判断是否删除节点数据 (true: 删除节点数据, false: 保留节点数据)
   */
  beforeDeleteNode?: (node: TreeNodeItem) => boolean | Promise<boolean>;
  /** 节点移动前的函数 (节点位置发生变化时调用该函数)
   * @param nodeId 要移动的节点id
   * @param targetNodeId 目标节点id
   * @param direction 位置 (before / inside / after)
   *  - before: 目标节点前面
   *  - inside: 作为目标节点的子节点
   *  - after: 目标节点后面
   * @returns 根据返回值判断是否进行此次节点移动操作 (true: 进行, false: 取消)
   */
  beforeMoveNode?: (
    nodeId: string,
    targetNodeId: string,
    direction: "before" | "inside" | "after",
  ) => boolean | Promise<boolean>;
  /**
   * 节点移动后的函数 (节点位置发生变化后调用该函数)
   */
  afterMoveNode?: (newData: TreeNodeItem[]) => void;
}

export interface TreeNodeItem {
  id: string;
  label: string;
  /** 是否为叶子节点 */
  isLeaf?: boolean;
  /** 是否展开 */
  expanded?: boolean;
  /** 是否正在加载 */
  loading?: boolean;
  /** 节点层级 */
  level?: number;
  children?: TreeNodeItem[];
  /** 父节点id (如果是根节点则为空) */
  pid?: string;
  /** 是否正在拖拽 */
  dragging?: boolean;
  /** 其他节点在当前节点悬浮位置的状态  */
  dragoverState?: "before" | "inside" | "after";
  /** 挂载标识符 */
  mounted?: boolean;
  /** 显示添加按钮 */
  showAddButton?: boolean;
  /** 显示编辑按钮 */
  showEditButton?: boolean;
  /** 显示删除按钮 */
  showDeleteButton?: boolean;
}

export interface VirtualTreeEmits {
  "node-click": [event: MouseEvent, node: TreeNodeItem];
  "node-dblclick": [event: MouseEvent, node: TreeNodeItem];
  "node-contextmenu": [event: PointerEvent, node: TreeNodeItem];
  "select-change": [selectedKeys: Readonly<string[]>];
}

export interface TreeNodeProps {
  /** 节点数据 */
  nodeData: TreeNodeItem;
  /** 节点的层级 @default 0 */
  level?: number;
  /** 节点缩进距离 @default 8 */
  indentSize?: number;
  /** 高亮关键词 */
  keywords?: string;
  /** 是否选中节点 */
  isSelected?: boolean;
  /** 是否可拖拽 */
  allowDrag?: boolean;
  /** 显示添加按钮 */
  showAddButton?: boolean;
  /** 显示删除按钮 */
  showDeleteButton?: boolean;
}

export interface TreeNodeLabelProps {
  theme?: ThemeMode;
  /** 标签文本 */
  label?: string;
  /** 是否是选中状态 */
  isSelected?: boolean;
  /** 是否展开 */
  expanded?: boolean;
  /** 是否处于加载状态 */
  loading?: boolean;
  /** 是否是叶子节点 */
  isLeaf?: boolean;
  /** 层级 */
  level?: number;
  /** 缩进大小 */
  indentSize?: number;
  /** 其他节点在当前节点悬浮位置的状态  */
  dragoverState?: "before" | "inside" | "after";
  /** 高亮关键词 */
  highlightKeyword?: string;
  /** 显示删除按钮 */
  showDeleteButton?: boolean;
  /** 显示添加按钮 */
  showAddButton?: boolean;
}
