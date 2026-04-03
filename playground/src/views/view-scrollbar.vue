<template>
  <base-split :percentage="0.2" orientation="vertical">
    <template #1>
      <div style="padding: 16px; display: flex; flex-wrap: wrap; gap: 36px">
        <div>
          <div style="width: 200px; flex-shrink: 0">
            <label>
              垂直滚动进度条: {{ (state.percentage.y * 100).toFixed() }}%
            </label>
            <div style="height: 30px; display: flex; align-items: center">
              <!-- <slider
                :disabled="!state.usePercentControl"
                v-model="state.percentage.y"
                :min="0"
                :step="0.001"
                :max="1"
                style="width: 100%"
              ></slider> -->
            </div>
          </div>
          <div style="width: 200px; flex-shrink: 0">
            <label>
              水平滚动进度条: {{ (state.percentage.x * 100).toFixed() }}%</label
            >
            <div style="height: 30px; display: flex; align-items: center">
              <!-- <slider
                :disabled="!state.usePercentControl"
                v-model="state.percentage.x"
                :min="0"
                :step="0.001"
                :max="1"
                style="width: 100%"
              ></slider> -->
            </div>
          </div>
        </div>
        <div>
          <div style="width: 200px; flex-shrink: 0">
            <label> 垂直滚动位置: {{ state.y.toFixed() }}px</label>
            <div style="height: 30px; display: flex; align-items: center">
              <!-- <slider
                :disabled="state.usePercentControl"
                v-model="state.y"
                :min="0"
                :step="1"
                :max="scrollbarRange.y"
                style="width: 100%"
              ></slider> -->
            </div>
          </div>
          <div style="width: 200px; flex-shrink: 0">
            <label> 水平滚动位置: {{ state.x.toFixed() }}px</label>
            <div style="height: 30px; display: flex; align-items: center">
              <!-- <slider
                :disabled="state.usePercentControl"
                v-model="state.x"
                :min="0"
                :step="1"
                :max="scrollbarRange.x"
                style="width: 100%"
              ></slider> -->
            </div>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 16px">
          <div style="display: flex; align-items: center">
            <label>百分比控制：</label>
            <!-- <ToggleSwitch v-model="state.usePercentControl"> </ToggleSwitch> -->
          </div>
          <div style="display: flex; align-items: center">
            <label>原生滚动条：</label>
            <!-- <ToggleSwitch v-model="state.useNativeScrollbar"> </ToggleSwitch> -->
          </div>
        </div>
        <div>
          {{ scrollbarRef?.arrivedState }}
        </div>
      </div>
    </template>
    <template #2>
      <BaseScrollbar
        ref="scrollbarRef"
        :disable="state.useNativeScrollbar"
        :valueMode="state.usePercentControl ? 'percent' : 'px'"
        v-model:scroll-y="scrollY"
        v-model:scroll-x="scrollX"
        @scroll="onScroll"
      >
        <div style="height: 200%; width: 200%">
          <div style="height: 100%; border: 20px solid wheat"></div>
        </div>
      </BaseScrollbar>
    </template>
  </base-split>
</template>

<script lang="ts" setup>
import { BaseSplit, BaseScrollbar } from "base-ui";
import { computed, onMounted, reactive, useTemplateRef } from "vue";

const scrollbarRef = useTemplateRef("scrollbarRef");

// 状态
const state = reactive({
  usePercentControl: true,
  useNativeScrollbar: false,
  percentage: {
    x: 0.5,
    y: 0.5,
  },
  x: 0,
  y: 0,
});

const scrollbarRange = reactive({
  x: 0,
  y: 0,
});

const scrollY = computed({
  get() {
    return state.usePercentControl ? state.percentage.y : state.y;
  },
  set(v) {
    if (state.usePercentControl) {
      state.percentage.y = v;
    } else {
      state.y = v;
    }
  },
});

const scrollX = computed({
  get() {
    return state.usePercentControl ? state.percentage.x : state.x;
  },
  set(v) {
    if (state.usePercentControl) {
      state.percentage.x = v;
    } else {
      state.x = v;
    }
  },
});

onMounted(() => {
  if (!scrollbarRef.value?.viewportDOM) return;
  const { scrollHeight = 0, scrollWidth = 0 } = scrollbarRef.value.viewportDOM;

  // console.log(scrollHeight, scrollWidth)
  scrollbarRange.y = scrollHeight;
  scrollbarRange.x = scrollWidth;
});

const onScroll: InstanceType<typeof BaseScrollbar>["onScroll"] = (
  x,
  y,
  xPercent,
  yPercent,
) => {
  if (state.usePercentControl) {
    // 使用百分比控制时候只需更新像素值
    state.x = x;
    state.y = y;
  } else {
    // 否则更新百分比值
    state.percentage.x = xPercent;
    state.percentage.y = yPercent;
  }
};
</script>

<style lang="scss" scoped></style>
