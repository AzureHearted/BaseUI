<template>
  <BaseFlex :gap="16" wrap>
    <BaseFlex class="card" direction="column" :gap="8">
      <BaseInput
        v-model="state.value"
        class="input-text"
        size="tiny"
        clearable
        placeholder="很小"
      >
        <template #prefix>前缀</template>
        <template #suffix>后缀</template>
      </BaseInput>
      <BaseInput
        v-model="state.value"
        class="input-text"
        size="small"
        clearable
        placeholder="小"
      >
        <template #prefix>前缀</template>
        <template #suffix>后缀</template>
      </BaseInput>
      <BaseInput
        v-model="state.value"
        class="input-text"
        clearable
        placeholder="中（默认）"
      >
        <template #prefix>前缀</template>
        <template #suffix>后缀</template>
      </BaseInput>
      <BaseInput
        v-model="state.value"
        class="input-text"
        size="large"
        placeholder="大"
      >
        <template #prefix>前缀</template>
        <template #suffix>后缀</template>
      </BaseInput>
      <span>{{ state.value }}</span>
    </BaseFlex>
    <BaseFlex class="card" direction="column" :gap="8" align="start">
      <BaseInput
        class="input-text"
        type="password"
        size="tiny"
        v-model="state.password"
        placeholder="输入密码"
        clearable
      ></BaseInput>
      <BaseInput
        class="input-text"
        type="password"
        size="small"
        v-model="state.password"
        placeholder="输入密码"
        clearable
      ></BaseInput>
      <BaseInput
        class="input-text"
        type="password"
        v-model="state.password"
        placeholder="输入密码"
        clearable
      ></BaseInput>
      <BaseInput
        class="input-text"
        type="password"
        size="large"
        v-model="state.password"
        placeholder="输入密码"
        clearable
      ></BaseInput>
      <span>{{ state.password }}</span>
    </BaseFlex>
    <BaseFlex class="card" direction="column" :gap="8" align="start">
      <BaseInputNumber
        class="input-number"
        size="tiny"
        v-model="state.number"
        placeholder="输入金额"
        clearable
      >
        <template #suffix>元</template>
      </BaseInputNumber>
      <BaseInputNumber
        class="input-number"
        size="small"
        v-model="state.number"
        placeholder="输入金额"
        clearable
      >
        <template #suffix>元</template>
      </BaseInputNumber>
      <BaseInputNumber
        class="input-number"
        v-model="state.number"
        placeholder="输入金额"
        clearable
      >
        <template #suffix>元</template>
      </BaseInputNumber>
      <BaseInputNumber
        class="input-number"
        size="large"
        :min="0"
        :max="20"
        v-model="state.number"
        placeholder="输入金额"
        clearable
      >
        <template #suffix>元</template>
      </BaseInputNumber>
      <span>{{ state.number }}</span>
    </BaseFlex>
    <BaseFlex class="card" direction="column" :gap="8">
      <BaseInput
        v-model="state.value"
        class="input-text"
        size="tiny"
        clearable
        round
        placeholder="很小"
      >
      </BaseInput>
      <BaseInput
        v-model="state.value"
        class="input-text"
        size="small"
        clearable
        round
        placeholder="小"
      >
      </BaseInput>
      <BaseInput
        v-model="state.value"
        class="input-text"
        clearable
        round
        placeholder="中（默认）"
      >
      </BaseInput>
      <BaseInput
        v-model="state.value"
        class="input-text"
        size="large"
        round
        placeholder="大"
      >
      </BaseInput>
      <span>{{ state.value }}</span>
    </BaseFlex>
  </BaseFlex>
</template>

<script lang="ts" setup>
import { BaseFlex, BaseInput, BaseInputNumber } from "base-ui";
import { reactive } from "vue";

const state = reactive({
  value: "123",
  password: "",
  number: 5,
});
</script>

<style lang="scss" scoped>
.card {
  border: 1px solid #000;
  padding: 16px;
  border-radius: 8px;

  :root.dark & {
    border: 1px solid #ccc;
  }
}
.input-text {
  width: 200px;
}
.input-number {
  width: 200px;
}
</style>
