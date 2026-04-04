<template>
  <div
    ref="nodeRef"
    class="base-tree__node"
    :data-level="level"
    :data-id="nodeData.id"
    :data-expanded="nodeData.expanded"
  >
    <NodeLabel
      ref="nodeLabelRef"
      :label="nodeData.label"
      :highlight-keyword="keywords"
      :expanded="nodeData.expanded"
      :loading="nodeData.loading"
      :is-selected="isSelected"
      :is-leaf="nodeData.isLeaf"
      :indent-size="indentSize"
      :level="level"
      :dragover-state="nodeData.dragoverState"
      :show-add-button="showAddButton || nodeData.showAddButton"
      :show-delete-button="showDeleteButton || nodeData.showDeleteButton"
      @click-add-button="onAddNode?.(nodeData.id)"
      @click-delete-button="onDeleteNode?.(nodeData.id)"
      @click="onClick"
      @dblclick="onDblClick"
      @contextmenu="onContextmenu"
      @click-icon="onToggleExpand?.(nodeData.id)"
    >
      <template #default>
        <slot v-if="$slots.default" name="default"></slot>
        <template v-else>
          {{ nodeData.label }}
        </template>
      </template>
    </NodeLabel>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  inject,
  onMounted,
  onUnmounted,
  useTemplateRef,
  watch,
  type ShallowRef,
} from "vue";

import NodeLabel from "./NodeLabel.vue";

import { useCustomDrag } from "@/hooks";
import { treeSymbol } from "./symbol";
import type { TreeNodeProps } from "./type";
import type { TreeContext } from "./Tree.vue";

defineOptions({
  name: "BaseTreeNode",
});

// 注入base-tabs提供的方法和属性
const {
  onNodeMounted,
  onNodeUnmounted,
  onNodeClick,
  onNodeDblClick,
  onNodeContextmenu,
  onToggleExpand,
  onNodeDragover,
  onNodeDrop,
  onAddNode,
  onDeleteNode,
} = inject<TreeContext | null>(treeSymbol, null) || {};

const props = withDefaults(defineProps<TreeNodeProps>(), {
  level: 0,
  indentSize: 16,
});

const keywords = computed(() => {
  return props.keywords;
});

onMounted(() => {
  // 通知父组件节点已挂载
  onNodeMounted?.(props.nodeData, nodeLabelRef.value?.$el);
});

onUnmounted(() => {
  // 通知父组件节点已卸载
  onNodeUnmounted?.(props.nodeData.id);
});

// f 点击节点时候的回调函数
function onClick(e: MouseEvent) {
  if (dragging.value) return;
  // 抛出单击事件
  onNodeClick?.(e, props.nodeData.id);
}

// f 双击节点时候的回调函数
function onDblClick(e: MouseEvent) {
  if (dragging.value) return;
  // 先抛出双击事件
  onNodeDblClick?.(e, props.nodeData.id);
  if (props.nodeData.isLeaf) return;
  // 切换展开状态
  onToggleExpand?.(props.nodeData.id);
}

// s 节点标签组件
const nodeLabelRef = useTemplateRef("nodeLabelRef") as ShallowRef<
  InstanceType<typeof NodeLabel>
>;

// f 右键点击节点时候的回调函数
function onContextmenu(e: PointerEvent) {
  if (dragging.value) return;
  nodeLabelRef.value?.$el.focus();
  onNodeContextmenu?.(e, props.nodeData.id);
}

watch(
  () => props.allowDrag,
  (newVal, oldVal) => {
    // console.log('allowDrag变化')
    if (newVal === oldVal) return;
    disableDrag.value = !newVal;
  },
);

onMounted(() => {
  disableDrag.value = !props.allowDrag;
});

// ? 使用自定义拖拽功能
const { disable: disableDrag, dragging } = useCustomDrag(
  () => nodeLabelRef.value?.$el,
  {
    ghostOffsetMethod: { x: "auto" },
    // 要克隆的DOM
    cloneDOM: () => nodeLabelRef.value?.labelContentLeftRef,
    onDragStart(_startPos, _e, ghostDOM) {
      if (!ghostDOM) return;
      props.nodeData.dragging = true;
      // 准备拖拽前的样式自定义
      ghostDOM.style.backgroundColor = "#096FD5bf";
      ghostDOM.style.borderRadius = "4px";
      ghostDOM.style.padding = "4px";
      ghostDOM.style.display = "flex";
      ghostDOM.style.alignItems = "center";
      ghostDOM.style.width = "auto";
      ghostDOM.style.maxWidth = "300px";
      ghostDOM.style.overflow = "hidden";
      ghostDOM.style.textOverflow = "ellipsis";
      ghostDOM.style.whiteSpace = "nowrap";
    },
    onDragMove(_pos, e, _ghostDOM) {
      if (!e.target) return;
      const target = e.target as HTMLElement;
      const targetLabelNode = target.closest<HTMLElement>(
        ".base-tree__node-label",
      );
      if (targetLabelNode) {
        // 计算鼠标悬浮在节点的哪个位置
        const targetPos = targetLabelNode.getBoundingClientRect();
        let overArea: "before" | "inside" | "after" = "inside";
        // 分为上中下
        if (e.clientY < targetPos.top + targetPos.height * 0.25) {
          overArea = "before";
        } else if (e.clientY > targetPos.top + targetPos.height * 0.75) {
          overArea = "after";
        } else {
          overArea = "inside";
        }
        // 寻找节点id
        const targetNode = targetLabelNode.parentNode as HTMLElement | null;
        const targetId = targetNode?.dataset.id;
        onNodeDragover?.(props.nodeData.id, targetId, overArea);
      } else {
        // 如果鼠标悬浮在非节点区域，则清除拖拽状态
        onNodeDragover?.(props.nodeData.id);
      }
    },
    // 放置时候的回调函数
    onDrop(_endPos, e, _ghostDOM) {
      props.nodeData.dragging = false;

      if (!e.target) return;
      const target = e.target as HTMLElement;
      const targetLabelNode = target.closest<HTMLElement>(
        ".base-tree__node-label",
      );
      if (!targetLabelNode) return;
      // 寻找节点id
      const targetNode = targetLabelNode.parentNode as HTMLElement | null;
      const targetId = targetNode?.dataset.id;
      if (!targetId) return;
      // 计算drop位置
      let dropArea: "before" | "inside" | "after" = "inside";
      const targetPos = targetLabelNode.getBoundingClientRect();
      // 分为上中下
      if (e.clientY < targetPos.top + targetPos.height * 0.25) {
        dropArea = "before";
      } else if (e.clientY > targetPos.top + targetPos.height * 0.75) {
        dropArea = "after";
      } else {
        dropArea = "inside";
      }
      onNodeDrop?.(props.nodeData.id, targetId, dropArea);
    },
  },
);
</script>

<style lang="scss" scoped>
.base-tree__node {
  position: relative;
  &__children {
    margin-left: 4px;
  }
}
</style>
