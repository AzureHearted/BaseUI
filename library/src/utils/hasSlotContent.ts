import { Comment, Text } from "vue";

export function hasSlotContent(slot?: (...args: any[]) => any[]) {
  if (!slot) return false;

  const vNodes = slot();

  return vNodes.some((vnode) => {
    // 过滤注释
    if (vnode.type === Comment) return false;

    // 过滤空文本
    if (vnode.type === Text && !vnode.children?.trim()) return false;

    return true;
  });
}
