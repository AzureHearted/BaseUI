<template>
  <BaseVirtualMasonry :items="galleryItems" allow-item-transition>
    <template #default="{ item }">
      <!-- <img :src="(item as Item).src" alt="" style="width: 100%" /> -->
      <BaseImg
        :src="(item as Item).src"
        use-thumb
        :thumb-max-size="2560"
        decoding="async"
      ></BaseImg>
    </template>
  </BaseVirtualMasonry>
</template>

<script setup lang="ts">
import { getAllImages } from "@/assets/test-images";
import { useParallelTask, type Task } from "@/hooks/useParallelTask";
import { getMetaByImage } from "@/utils/Meta/getMetaByImage";
import {
  BaseImg,
  BaseVirtualMasonry,
  type BaseVirtualMasonryItem,
} from "base-ui";
import { computed, onMounted, reactive } from "vue";

interface Item extends BaseVirtualMasonryItem {
  src: string;
}

const state = reactive({
  items: [] as Item[],
});

const galleryItems = computed(() => state.items.filter((x) => x != null));

onMounted(init);

async function init() {
  console.log("初始化瀑布流数据");
  const paths = await getAllImages();
  console.log("获取到的路径", paths);

  const tasks: Task<Item>[] = paths.map((path) => {
    return {
      async handle() {
        const meta = await getMetaByImage(path);
        return {
          id: path,
          src: path,
          aspectRatio: meta.aspectRatio,
        };
      },
    };
  });
  const { run } = useParallelTask(tasks, {
    onTaskComplete(index, result, completedCount, stop) {
      console.log(`Task ${index} completed with result`, result);
      state.items[index] = result;
    },
  });

  run();
}
</script>

<style lang="scss" scoped></style>
