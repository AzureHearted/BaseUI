import type { ThemeMode } from "@/theme";
import { usePreferredDark } from "@vueuse/core";

const systemIsDark = usePreferredDark();

export function resolveIsDark(mode: ThemeMode): boolean {
  if (mode === "dark") return true;
  if (mode === "light") return false;

  // system
  return systemIsDark.value;
}
