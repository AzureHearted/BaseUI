import type { InjectionKey, Ref } from "vue";

export type ThemeMode = "system" | "light" | "dark";

export interface ThemeContext {
  mode: Ref<ThemeMode>;
  isDark: Ref<boolean>;
}

export const ThemeKey: InjectionKey<ThemeContext> = Symbol("theme");
