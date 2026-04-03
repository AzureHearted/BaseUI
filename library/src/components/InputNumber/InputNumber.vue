<template>
  <PureInput v-bind="props" @wheel.prevent="handMouseWheel">
    <template #prefix="slotProps">
      <slot name="prefix" v-bind="slotProps"></slot>
    </template>
    <template #default>
      <input
        ref="inputRef"
        type="number"
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
      <div class="base-input__control">
        <div class="base-input__control__button" @click="down">
          <icon-ic-round-minus />
        </div>
        <div class="base-input__control__button" @click="up">
          <icon-ic-round-plus />
        </div>
      </div>
    </template>
  </PureInput>
</template>

<script setup lang="ts">
import { computed, useTemplateRef, watch, type ShallowRef } from "vue";
import type { InputNumberProps } from "./types";
import PureInput from "../PureInput/PureInput.vue";

defineOptions({
  name: "BaseInput",
});

const props = withDefaults(defineProps<InputNumberProps>(), {
  step: 1,
});

const modelValue = defineModel<number | null>({
  default: 0,
});

const emits = defineEmits<{
  focus: [e: FocusEvent];
  blur: [e: FocusEvent];
}>();

const canShowClearButton = computed(() => modelValue.value != null);

const inputRef = useTemplateRef(
  "inputRef",
) as ShallowRef<HTMLInputElement | null>;

// 输入
function handleInput(e: Event) {
  const val = (e.target as HTMLInputElement).valueAsNumber;
  // 如果输入框被清空，val 是 NaN，此时建议给 null 或 0
  modelValue.value = isNaN(val) ? null : val;
}

// 清空
function handleClear() {
  modelValue.value = null;
}

// 事件透传
function handleFocus(e: FocusEvent) {
  emits("focus", e);
}

function handleBlur(e: FocusEvent) {
  emits("blur", e);
}

function handMouseWheel(e: WheelEvent) {
  modelValue.value = modelValue.value || 0;
  if (e.deltaY < 0) up();
  else down();
}

function up() {
  // 确保基础值是数字，避免 NaN 参与运算
  const current =
    modelValue.value === null || isNaN(modelValue.value) ? 0 : modelValue.value;
  modelValue.value = current + props.step;
}

function down() {
  const current =
    modelValue.value === null || isNaN(modelValue.value) ? 0 : modelValue.value;
  modelValue.value = current - props.step;
}

watch(modelValue, (newVal) => {
  if (newVal === null || isNaN(newVal)) return; // 拦截无效值

  let correctedVal = newVal;
  if (props.max != null && newVal > props.max) correctedVal = props.max;
  if (props.min != null && newVal < props.min) correctedVal = props.min;

  if (correctedVal !== newVal) {
    modelValue.value = correctedVal;
  }
});
</script>

<style lang="scss" scoped>
@use "@/components/PureInput/style.scss" as *;

@include clearDefaultInputStyle(".base-input__inner__input");

.base-input {
  &__inner__input {
    width: 100%;
    min-width: 0;
    font-size: var(--font-size);
    color: var(--text-color);
    height: var(--height);
    line-height: var(--height);
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

  &__control {
    display: flex;

    margin-left: 0.5rem;
    overflow: hidden;

    user-select: none;

    &__button {
      display: flex;
      align-items: center;

      font-size: 20px;

      color: var(--icon-color);
      &:hover {
        color: var(--icon-hover-color);
      }
    }
  }
}
</style>
