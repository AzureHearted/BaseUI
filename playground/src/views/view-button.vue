<template>
  <BaseFlex direction="column" :gap="4">
    <BaseFlex :gap="4" align="center" wrap="wrap">
      <BaseButton> default </BaseButton>
      <BaseButton type="primary"> primary </BaseButton>
      <BaseButton type="success"> success </BaseButton>
      <BaseButton type="info"> info </BaseButton>
      <BaseButton type="warning"> warning </BaseButton>
      <BaseButton type="danger"> danger </BaseButton>
    </BaseFlex>
    <BaseFlex :gap="4" align="center" wrap="wrap">
      <BaseButton size="tiny">尺寸：tiny</BaseButton>
      <BaseButton size="small">尺寸：small</BaseButton>
      <BaseButton size="medium">尺寸：medium</BaseButton>
      <BaseButton size="large">尺寸：large</BaseButton>
    </BaseFlex>
    <BaseFlex :gap="4" align="center" wrap="wrap">
      <BaseButton round size="tiny">圆角</BaseButton>
      <BaseButton round size="small">圆角</BaseButton>
      <BaseButton round size="medium">圆角</BaseButton>
      <BaseButton round size="large">圆角</BaseButton>
    </BaseFlex>
    <BaseFlex :gap="4" align="center" wrap="wrap">
      <BaseButton disabled>禁用</BaseButton>
      <BaseButton disabled type="primary">禁用</BaseButton>
      <BaseButton disabled type="success">禁用</BaseButton>
      <BaseButton disabled type="info">禁用</BaseButton>
      <BaseButton disabled type="warning">禁用</BaseButton>
      <BaseButton disabled type="danger">禁用</BaseButton>
    </BaseFlex>
    <BaseFlex :gap="4" align="center" wrap="wrap">
      <BaseButton
        :loading="state.loading"
        loading-type="warning"
        allow-loading-click
        @click="onLoading"
        @loading-click="onCancelLoading"
      >
        <template v-if="!state.loading">点我加载</template>
        <template v-else> 停止加载</template>
      </BaseButton>
      <BaseButton loading>加载中</BaseButton>
      <BaseButton loading type="primary">加载中</BaseButton>
      <BaseButton loading type="success">加载中</BaseButton>
      <BaseButton loading type="info">加载中</BaseButton>
      <BaseButton loading type="warning">加载中</BaseButton>
      <BaseButton loading type="danger">加载中</BaseButton>
    </BaseFlex>
  </BaseFlex>
</template>

<script setup lang="ts">
import { BaseButton, BaseFlex } from "base-ui";
import { reactive } from "vue";

const state = reactive({
  loading: false,
});

let timer: number;

function onLoading() {
  state.loading = true;

  timer = setTimeout(() => {
    state.loading = false;
    console.log("loading完成");
  }, 3000);
}

function onCancelLoading() {
  clearTimeout(timer);
  console.log("已取消loading");
  state.loading = false;
}
</script>

<style lang="scss" scoped></style>
