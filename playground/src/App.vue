<template>
  <BaseProvider :theme="theme">
    <main>
      <BaseFlex
        :gap="4"
        direction="column"
        style="flex-shrink: 0; margin-bottom: 4px"
      >
        <h1>base-ui 实验室</h1>
        <BaseFlex align="center" :gap="4">
          <label>主题:</label>
          <BaseButton size="small" @click="theme = 'dark'"> 暗色 </BaseButton>
          <BaseButton size="small" @click="theme = 'light'"> 亮色 </BaseButton>
          <BaseButton size="small" @click="theme = 'system'">
            跟随系统
          </BaseButton>
        </BaseFlex>
      </BaseFlex>
      <BaseTabs
        v-model="state.currentTab"
        content-style="padding: 10px;"
        style="flex: 1; overflow: hidden"
      >
        <BaseTabPane name="media" label="媒体元素">
          <ViewMedia />
        </BaseTabPane>
        <BaseTabPane name="input" label="输入框">
          <ViewInput />
        </BaseTabPane>
        <BaseTabPane name="button" label="按钮">
          <ViewButton />
        </BaseTabPane>
        <BaseTabPane name="flex" label="Flex布局">
          <ViewFlex />
        </BaseTabPane>
        <BaseTabPane name="split" label="分栏布局">
          <ViewSplit />
        </BaseTabPane>
        <BaseTabPane name="scrollbar" label="滚动条">
          <ViewScrollbar />
        </BaseTabPane>
        <BaseTabPane name="tabs" label="标签页">
          <ViewTabs />
        </BaseTabPane>
        <BaseTabPane name="virtual-masonry" label="虚拟化瀑布流">
          <ViewVirtualMasonry />
        </BaseTabPane>
      </BaseTabs>
    </main>
  </BaseProvider>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";
import { useDark, usePreferredDark } from "@vueuse/core";
// 导入组件
import {
  BaseFlex,
  BaseButton,
  BaseTabPane,
  BaseTabs,
  BaseProvider,
  type ThemeMode,
} from "base-ui";

import { usePalygroundStore } from "./stores/palyground";

// 测试组件
import ViewFlex from "./views/view-flex.vue";
import ViewTabs from "./views/view-tabs.vue";
import ViewButton from "./views/view-button.vue";
import ViewVirtualMasonry from "./views/view-virtual-masonry.vue";
import ViewSplit from "./views/view-split.vue";
import ViewInput from "./views/view-input.vue";
import ViewScrollbar from "./views/view-scrollbar.vue";
import ViewMedia from "./views/view-media.vue";

const systemIsDark = usePreferredDark();

const theme = ref<ThemeMode>("system");

const isDark = useDark();

onMounted(() => {
  updateTheme(theme.value);
});

watch(theme, (val) => {
  updateTheme(val);
});

function updateTheme(theme: ThemeMode) {
  if (theme === "system") {
    isDark.value = systemIsDark.value;
  } else {
    isDark.value = theme === "dark";
  }
}

const palygroundStore = usePalygroundStore();

const { state } = storeToRefs(palygroundStore);
</script>

<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;
  padding: 10px;
  padding-top: 0;
  height: 100vh;
}
</style>
