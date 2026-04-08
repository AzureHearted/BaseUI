type Size = number | string;

interface ParseCssSizeOptions {
  direction: "width" | "height";
  element: HTMLElement | null;
}

/**
 * 解析 CSS 尺寸单位，支持以下单位：
 * - px
 * - %
 * - vw
 * - vh
 * - rem（基于 root font-size）
 * - 纯数字字符串（视为 px）
 * - 数字类型按 % 计算
 * @param value 值
 * @param element 参考元素（可选，百分比相关的尺寸会参考该元素）
 * @returns
 */
export function parseCssSize(
  value: Size,
  options?: ParseCssSizeOptions,
): number {
  const { direction, element } = options || {};

  // 1️⃣ number 则参考 element 计算
  if (typeof value === "number") {
    if (element) {
      const base = getBaseSize(element);
      return direction === "width" ? value * base.width : value * base.height;
    } else {
      throw new Error(`number 类型尺寸需要参考一个有效的元素: ${value}`);
    }
  }

  const v = value.trim();

  // 2️⃣ px
  if (v.endsWith("px")) {
    return parseFloat(v);
  }

  // 3️⃣ %
  if (v.endsWith("%")) {
    const percent = parseFloat(v) / 100;
    if (element) {
      const base = getBaseSize(element);
      return direction === "width"
        ? percent * base.width
        : percent * base.height;
    } else {
      throw new Error(`% 类型尺寸需要参考一个有效的元素: ${v}`);
    }
  }

  // 4️⃣ vw
  if (v.endsWith("vw")) {
    return (parseFloat(v) / 100) * window.innerWidth;
  }

  // 5️⃣ vh
  if (v.endsWith("vh")) {
    return (parseFloat(v) / 100) * window.innerHeight;
  }

  // 6️⃣ rem（基于 root font-size）
  if (v.endsWith("rem")) {
    const fontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize,
    );
    return parseFloat(v) * fontSize;
  }

  // 7️⃣ 纯数字字符串
  if (!isNaN(Number(v))) {
    return Number(v);
  }

  throw new Error(`Unsupported size value: ${value}`);
}

function getBaseSize(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
  };
}
