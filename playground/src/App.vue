<template>
  <main>
    <h1>base-ui playground</h1>
    <p>测试你的组件库</p>
    <div class="container">
      <CountButton v-model="count" />
      <CountButton v-model="count" prefix="按下: " />
      <CountButton v-model="count" suffix=" 点击" />
      <CountButton v-model="count" v-bind="buttonProps" />
    </div>
  </main>
</template>

<script setup lang="ts">
// 导入组件
import { CountButton, type CountButtonProps } from "base-ui";
import { ref } from "vue";

const count = ref(0);

const buttonProps: CountButtonProps = {
  prefix: "你按了按钮 ",
  suffix: " 次",
};
</script>

<style scoped lang="scss">
main {
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  max-width: 700px;
  margin: 0 auto;
  padding: 0 2rem;

  & > h1 {
    font-size: 2rem;
    font-weight: 600;
  }

  & > p {
    color: rgba(60, 60, 60, 0.29);
  }
}

main > .container {
  margin-top: 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  border: 1px dashed rgba(60, 60, 60, 0.29);
  border-radius: 0.4rem;
  padding: 1.6rem;
  width: 100%;
}

@media (prefers-color-scheme: dark) {
  main {
    & > .container {
      border: 2px dashed #4b4a4a;
    }
    & > p {
      color: #4b4a4a;
    }
  }
}
</style>
