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
          v-for="(tab, index) in tabs"
          :key="tab.name"
          :name="tab.name"
          :order="index"
        >
          <template #label>
            <BaseFlex align="center" :gap="8">
              <span> {{ tab.label }} </span>
              <BaseButton size="tiny" @click.stop="() => addTab(index)">
                +
              </BaseButton>
              <BaseButton size="tiny" @click.stop="() => removeTab(index)">
                -
              </BaseButton>
            </BaseFlex>
          </template>
          <div style="padding: 4px">tab - {{ index }} 内容</div>
        </BaseTabPane>

      </BaseTabs>
    </template>
  </BaseSplit>
</template>

<script lang="ts" setup>
import {
  BaseSplit,
  BaseTabs,
  BaseTabPane,
  BaseFlex,
  BaseButton,
} from "base-ui";
import type { TabPaneProps } from "node_modules/base-ui/dist/components/Tabs/types";
import { reactive, ref } from "vue";

const state = reactive({
  count: 2,
  showTabsCrl: false,
});

const tabs = ref<TabPaneProps[]>([
  createTab({ label: "标签页1" }),
  createTab({ label: "标签页2" }),
]);

function addTab(currentIndex: number) {
  const newTab = createTab();
  tabs.value.splice(currentIndex + 1, 0, newTab);
}

function removeTab(index: number) {
  tabs.value.splice(index, 1);
}

function createTab(raw?: Partial<TabPaneProps>): TabPaneProps {
  return {
    name: raw?.name ?? crypto.randomUUID(),
    label: raw?.label ?? "新标签页",
  };
}
</script>

<style lang="scss" scoped></style>
