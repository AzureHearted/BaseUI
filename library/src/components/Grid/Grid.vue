<template>
  <div ref="container" class="base-grid" :style="gridStyle">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { GridProps } from "./types";

defineOptions({
  name: "BaseGrid",
});

const props = withDefaults(defineProps<GridProps>(), {
  inline: false,
});

// const container = ref<HTMLElement>();

/**
 * 统一样式计算
 */
const gridStyle = computed(() => {
  const style: Record<string, any> = {};

  // display
  style.display = props.inline ? "inline-grid" : "grid";

  // gap
  if (props.gap !== undefined) style.gap = props.gap;
  if (props.rowGap !== undefined) style.rowGap = props.rowGap;
  if (props.columnGap !== undefined) style.columnGap = props.columnGap;

  // columns / rows
  // columns / cols（优先级控制）
  if (props.columns) {
    style.gridTemplateColumns = props.columns;
  } else if (props.cols) {
    style.gridTemplateColumns = `repeat(${props.cols}, 1fr)`;
  }
  if (props.rows) style.gridTemplateRows = props.rows;

  // auto
  if (props.autoColumns) style.gridAutoColumns = props.autoColumns;
  if (props.autoRows) style.gridAutoRows = props.autoRows;

  // autoFlow + dense
  if (props.autoFlow || props.dense) {
    style.gridAutoFlow = `${props.autoFlow ?? "row"}${
      props.dense ? " dense" : ""
    }`;
  }

  // 对齐
  if (props.justifyItems) style.justifyItems = props.justifyItems;
  if (props.alignItems) style.alignItems = props.alignItems;

  if (props.justifyContent) style.justifyContent = props.justifyContent;
  if (props.alignContent) style.alignContent = props.alignContent;

  if (props.placeItems) style.placeItems = props.placeItems;
  if (props.placeContent) style.placeContent = props.placeContent;

  return style;
});
</script>

<style lang="scss" scoped>
.base-grid {
  display: grid;
}
</style>
