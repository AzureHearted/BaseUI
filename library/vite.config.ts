import { URL, fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import vuePlugin from "@vitejs/plugin-vue";
import dtsPlugin from "vite-plugin-dts";

// noinspection JSUnusedGlobalSymbols - suppresses "exported but not used" warning in WebStorm
export default defineConfig({
  plugins: [
    vuePlugin(),
    dtsPlugin({
      insertTypesEntry: true,
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
      name: "base-ui",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
