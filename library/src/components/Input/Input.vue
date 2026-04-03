<template>
  <PureInput v-bind="props">
    <template #prefix="slotProps">
      <slot name="prefix" v-bind="slotProps"></slot>
    </template>
    <template #default>
      <input
        ref="inputRef"
        :type="type"
        class="base-input__inner__input"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
    </template>
    <template #suffix="slotProps">
      <slot name="suffix" v-bind="slotProps"></slot>
      <div
        v-if="clearable"
        class="base-input__clear-button"
        :data-can-show="canShowClearButton"
        @click="handleClear"
      >
        <icon-pajamas-clear />
      </div>
    </template>
  </PureInput>
</template>

<script setup lang="ts">
import { computed, useTemplateRef, type ShallowRef } from "vue";
import type { InputProps } from "./types";
import PureInput from "../PureInput/PureInput.vue";
import Scrollbar from "../Scrollbar/Scrollbar.vue";

defineOptions({
  name: "BaseInput",
});

const props = withDefaults(defineProps<InputProps>(), {
  type: "text",
});

const modelValue = defineModel<string>({
  default: "",
});

const emits = defineEmits<{
  focus: [e: FocusEvent];
  blur: [e: FocusEvent];
}>();

const canShowClearButton = computed(() => modelValue.value.trim() !== "");

const inputRef = useTemplateRef(
  "inputRef",
) as ShallowRef<HTMLInputElement | null>;

// 输入
function handleInput(e: Event) {
  modelValue.value = (e.target as HTMLInputElement).value;
}

// 清空
function handleClear() {
  modelValue.value = "";
}

// 事件透传
function handleFocus(e: FocusEvent) {
  emits("focus", e);
}

function handleBlur(e: FocusEvent) {
  emits("blur", e);
}
</script>

<style lang="scss" scoped>
@use "@/styles/tools.scss" as *;

@include clearDefaultInputStyle(".base-input__inner__input");

.base-input {
  &__inner__input {
    width: 100%;
    min-width: 0;
    font-size: var(--font-size);
    color: var(--text-color);
    height: var(--height);
    line-height: var(--height);

    resize: vertical;
  }

  &__clear-button {
    opacity: 0;
    display: flex;
    align-items: center;
    width: 0;
    height: 0;
    color: var(--icon-color);
    margin-left: 0;
    transition: 0.3s;
  }

  &:hover &__clear-button[data-can-show="true"] {
    width: 1rem;
    height: 1rem;
    opacity: 1;
    margin-left: 0.5rem;

    &:hover {
      color: var(--icon-hover-color);
    }
  }
}
</style>
