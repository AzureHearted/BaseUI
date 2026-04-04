<template>
  <BaseSplit orientation="vertical">
    <template #1>
      <BaseFlex :gap="16" wrap style="padding: 16px">
        <BaseFlex style="width: 200px; flex-shrink: 0">
          <label>
            控制条 first 区域占比:
            {{ (state.percentage * 100).toFixed() }}%
          </label>
          <BaseFlex align="center" style="height: 30px">
            <!-- <slider
              v-model="state.percentage"
              :min="0"
              :step="0.01"
              :max="1"
              style="width: 100%"
            ></slider> -->
          </BaseFlex>
        </BaseFlex>
        <BaseFlex style="width: 200px; flex-shrink: 0">
          <label> 控制条宽度: {{ state.controlBarSize }}px</label>
          <BaseFlex align="center" style="height: 30px">
            <!-- <slider
              v-model="state.controlBarSize"
              :min="0"
              :max="100"
              style="width: 100%"
            ></slider> -->
          </BaseFlex>
        </BaseFlex>
        <BaseFlex style="width: 200px; flex-shrink: 0">
          <label>
            最小占比: {{ (state.minSizePercent * 100).toFixed(0) }}%
          </label>
          <BaseFlex align="center" style="height: 30px">
            <!-- <slider
              v-model="state.minSizePercent"
              :min="0"
              :step="0.01"
              :max="0.6"
              style="width: 100%"
            ></slider> -->
          </BaseFlex>
        </BaseFlex>
        <BaseFlex style="width: 200px; flex-shrink: 0">
          <label>
            控制条悬浮后的扩展宽度: {{ state.controlBarHoverExtend }}px</label
          >
          <BaseFlex align="center" style="height: 30px">
            <!-- <slider
              v-model="state.controlBarHoverExtend"
              :min="0"
              :step="0.5"
              :max="100"
              style="width: 100%"
            ></slider> -->
          </BaseFlex>
        </BaseFlex>
        <BaseFlex style="width: 200px; flex-shrink: 0">
          <label>
            控制条热区左右各扩展宽度:
            {{ state.controlBarHotAreaExtend }}px</label
          >
          <BaseFlex align="center" style="height: 30px">
            <!-- <slider
              v-model="state.controlBarHotAreaExtend"
              :min="0"
              :step="0.5"
              :max="100"
              style="width: 100%"
            ></slider> -->
          </BaseFlex>
        </BaseFlex>
        <BaseFlex align="center" style="height: 30px">
          <!-- <select-button
            v-model="state.orientation"
            :options="['horizontal', 'vertical']"
          /> -->
          {{ state.vertical }}
        </BaseFlex>
      </BaseFlex>
    </template>
    <template #2>
      <BaseSplit
        ref="splitRef"
        :vertical="state.vertical"
        v-model:percentage="state.percentage"
        :control-bar-size="state.controlBarSize"
        :min-size-percent="state.minSizePercent"
        :control-bar-hover-extend="state.controlBarHoverExtend"
        :control-bar-hot-area-extend="state.controlBarHotAreaExtend"
      >
        <template #1> 区域1 </template>
        <template #2> 区域2 </template>
      </BaseSplit>
    </template>
  </BaseSplit>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { BaseSplit, BaseFlex, type BaseSplitProps } from "base-ui";

const state = reactive({
  vertical: false as BaseSplitProps["vertical"],
  percentage: 0.5,
  controlBarSize: 1,
  minSizePercent: 0.1,
  controlBarHoverExtend: 0.5,
  controlBarHotAreaExtend: 2,
});
</script>

<style lang="scss" scoped></style>
