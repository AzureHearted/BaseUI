<template>
  <div style="border: 1px solid wheat; height: 100%">
    <BaseSplit>
      <template #1>
        <BaseFlex direction="column" style="margin: 16px; background: gray">
          <label style="align-self: center">视频</label>
          <BaseVideo
            :src="videoState.src"
            use-thumb
            :thumb="videoState.poster"
            hover-play
            loop
          />
        </BaseFlex>
      </template>
      <template #2>
        <BaseFlex direction="column" style="margin: 16px; background: gray">
          <label style="align-self: center">图片</label>
          <BaseImg :src="imageState.src" show-loading-animation> </BaseImg>
        </BaseFlex>
      </template>
    </BaseSplit>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { BaseFlex, BaseImg, BaseSplit, BaseVideo } from "base-ui";

const videoState = reactive({
  src: "https://www.w3schools.com/html/mov_bbb.mp4",
  poster: "https://novenn.github.io/random/images/37.jpg",
  autoplay: true,
  loop: true,
  controls: true,
  muted: true,
});

const imageState = reactive({
  src: "https://novenn.github.io/random/images/37.jpg",
});
</script>

<style lang="scss" scoped></style>
