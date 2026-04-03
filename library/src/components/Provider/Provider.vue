<template>
  <slot />
</template>

<script setup lang="ts">
import { ref, provide, watchEffect, watch, computed, onMounted } from "vue";
import { resolveIsDark } from "@/utils/theme";
import { ThemeKey, type ThemeMode } from "@/theme";
import type { ProviderProps } from "./types";
import { usePreferredDark } from "@vueuse/core";

const props = withDefaults(defineProps<ProviderProps>(), {
  theme: "system",
});

const mode = computed(() => {
  return props.theme ?? "system";
});

const isDark = ref(resolveIsDark(mode.value));

const systemIsDark = usePreferredDark();

// 自动响应变化
watch([systemIsDark, mode], () => {
  isDark.value = resolveIsDark(mode.value);
});

// 提供给子组件
provide(ThemeKey, {
  mode,
  isDark,
});
</script>
