<template>
  <BaseFlex wrap :gap="4">
    <BaseFlex v-for="i in 10" class="box" align="center" justify="center">
      {{ i }}
    </BaseFlex>
  </BaseFlex>
</template>

<script lang="ts" setup>
import { BaseFlex } from "base-ui";
</script>

<style lang="scss" scoped>
.box {
  flex-grow: 1;
  width: 100px;
  aspect-ratio: 1;
  max-width: 200px;
  // margin: 4px;
  background: orange;
}
</style>
