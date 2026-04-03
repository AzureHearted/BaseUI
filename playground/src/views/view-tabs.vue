<template>
  <BaseSplit orientation="vertical" :percentage="0.2">
    <template #1>
      <BaseFlex direction="column">
        <BaseFlex align="center">
          <label for="count">标签页数量：</label>
          <input type="number" v-model="state.count" name="count" />
        </BaseFlex>
        <BaseFlex align="center" :gap="4">
          <label for="showTabsCrl">显示控制按钮:</label>
          <input
            type="checkbox"
            name="showTabsCrl"
            v-model="state.showTabsCrl"
          />
        </BaseFlex>
      </BaseFlex>
    </template>
    <template #2>
      <BaseTabs
        :show-buttons="state.showTabsCrl"
        style="height: 100%; overflow: hidden"
      >
        <BaseTabPane
          v-for="index in state.count"
          :key="index"
          :name="`tab_${index}`"
        >
          <template #label>
            {{ index }}
          </template>
          <div style="padding: 4px">tab - {{ index }} 内容</div>
        </BaseTabPane>
        <BaseTabPane name="#">
          <template #label>
            <div style="display: flex; align-items: center; gap: 4px">
              <!-- <span style="line-height: 1">
                <icon-mdi-account-supervisor-circle />
              </span> -->
              测试
            </div>
          </template>
          <div style="height: 1000px">测试</div>
        </BaseTabPane>
      </BaseTabs>
    </template>
  </BaseSplit>
</template>

<script lang="ts" setup>
import { BaseSplit, BaseTabs, BaseTabPane, BaseFlex } from "base-ui";
import { reactive } from "vue";

const state = reactive({
  count: 2,
  showTabsCrl: false,
});
</script>

<style lang="scss" scoped></style>
