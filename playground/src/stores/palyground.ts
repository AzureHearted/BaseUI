import { defineStore } from "pinia";
import { reactive } from "vue";

export const usePalygroundStore = defineStore(
  "palygroundStore",
  () => {
    const state = reactive({
      currentTab: "button",
    });
    return {
      state,
    };
  },
  { persist: true },
);
