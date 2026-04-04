<template>
  <div class="base-flex">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import type { FlexProps } from "./types";

const props = withDefaults(defineProps<FlexProps>(), {
  direction: "row",
  justify: "normal",
  align: "normal",
  gap: 0,
});

const gapValue = computed(() => (props.gap ? `${props.gap}px` : "0"));
const wrapValue = computed(() => {
  if (props.wrap != null) {
    return props.wrap ? "wrap" : "nowrap";
  } else {
    return;
  }
});
</script>

<style lang="scss" scoped>
.base-flex {
  display: flex;
  flex-direction: v-bind("props.direction");
  flex-wrap: v-bind("wrapValue");
  justify-content: v-bind("props.justify");
  align-items: v-bind("props.align");
  gap: v-bind("gapValue");
}
</style>
