import { URL, fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

import Components from "unplugin-vue-components/vite";
import Icon from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";

// noinspection JSUnusedGlobalSymbols - suppresses "exported but not used" warning in WebStorm
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        IconsResolver({
          prefix: "icon",
        }),
      ],
    }),
    Icon({
      autoInstall: true,
      scale: 1,
    }),
    dts({
      insertTypesEntry: true,
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    dedupe: ["vue"], // ⭐ 核心
  },
  css: {
    // 预处理器配置项
    preprocessorOptions: {
      scss: {
        additionalData: `
            @use "@/styles/themes/main.scss" as *;
          `,
      },
    },
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
      name: "base-ui",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["vue", "@vueuse/core", "hammerjs", "lodash"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
