import {
  getCurrentInstance,
  h,
  onActivated,
  onDeactivated,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  render,
  toValue,
} from "vue";
import type { MaybeRefOrGetter, Ref, ShallowRef } from "vue";
import ContextMenu from "./ContextMenu.vue";
import { unrefElement } from "@vueuse/core";
import type { ThemeMode } from "@/theme";
import type { ContextMenuOption } from "./types";

// t 可能的 HTMLElement 类型
type MaybeHTMLElementRef =
  | MaybeRefOrGetter<HTMLElement | null | undefined>
  | Readonly<Ref<HTMLElement | null>>
  | Readonly<ShallowRef<HTMLElement | null>>;

// t 定义菜单项配置
type BaseContextMenuOptions = {
  root?: MaybeHTMLElementRef;
  fontSize?: MaybeRefOrGetter<number | null | undefined>;
  theme?: MaybeRefOrGetter<ThemeMode | null | undefined>;
};

/**
 *  动态创建并返回一个用于显示右键菜单的函数。
 *  @returns
 */
export function useContextMenu(options?: BaseContextMenuOptions) {
  const currentInstance = getCurrentInstance();

  if (!currentInstance) {
    throw new Error("useContextMenu 必须在 setup 中调用");
  }

  // 创建一个临时的 DOM 容器
  const container = document.createElement("div");
  // s 目标元素DOM
  const rootDOM = ref<HTMLElement | undefined>();

  const state = reactive({
    isMounted: false,
  });

  let exposed: {
    showMenu?: InstanceType<typeof ContextMenu>["showMenu"];
  } | null = null;

  // w 组件挂载后进行初始化
  onMounted(() => {
    init();
    state.isMounted = true;
  });

  // w 组件冻结时销毁右键菜单组件
  onDeactivated(() => destroy());

  // w 组件激活时重新初始化右键菜单组件
  onActivated(() => {
    if (!state.isMounted) return;
    init();
  });

  // f 初始化函数
  function init() {
    destroy();

    rootDOM.value = unrefElement(toValue(options?.root)) ?? document.body;
    rootDOM.value.appendChild(container);
  }

  // f 销毁函数
  function destroy() {
    // 卸载 vnode
    render(null, container);
    // 销毁组件
    if (container.isConnected) {
      rootDOM.value?.removeChild(container);
    }
  }

  // w 组件销毁时销毁组件
  onUnmounted(() => destroy());

  /**
   * f 显示菜单并等待用户选择
   * @param  event - 触发右键菜单的事件
   * @param menuItems - 菜单项配置 { label: string, command: string }
   * @returns  返回选中的 command 或 null
   */
  const showContextMenu = async <T>(
    event: PointerEvent,
    menuItems: Array<ContextMenuOption<T>>,
  ): Promise<T | null> => {
    // 创建 vnode（替代 createApp）
    const vnode = h(ContextMenu, {
      fontSize: toValue(options?.fontSize) ?? 16,
      theme: toValue(options?.theme) ?? undefined,
    });

    render(vnode, container);
    // 拿到组件暴露的属性和方法
    exposed = vnode.component?.exposed as any;

    if (!exposed) {
      console.warn("ContextMenu 尚未初始化");
      return null;
    }

    try {
      // 调用组件实例内部的 showMenu 方法
      const command = (await exposed.showMenu?.(event, menuItems)) ?? null;
      return command;
    } catch (e) {
      console.error("显示上下文菜单时出错：", e);
      return null;
    }
  };

  return { showContextMenu, init };
}
