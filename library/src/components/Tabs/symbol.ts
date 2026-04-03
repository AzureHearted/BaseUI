import type { InjectionKey, Reactive, Ref } from "vue";
import type { TabItem, TabItemRegistered } from "./types";

interface TabsContext {
  registerTab: (tab: TabItemRegistered) => void;
  updateTab: (id: string, data: Partial<TabItem>) => Promise<void>;
  unregisterTab: (id: string) => Promise<void>;
  active: Ref<string>;
  tabs: Reactive<TabItemRegistered[]>;
}

export const tabsSymbol: InjectionKey<TabsContext> = Symbol("tabs");
