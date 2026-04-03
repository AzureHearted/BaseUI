import { Meta } from "../../models/Meta";
import { getExtByUrl } from "../Url/getExtByUrl";

// 通过Image对象获取图片meta
export function getMetaByImage(url: string): Promise<Meta> {
  if (!url || !url.trim().length) {
    const errMeta: Meta = new Meta();
    return Promise.resolve(errMeta);
  }
  let meta: Meta;

  return new Promise((resolve) => {
    let img: HTMLImageElement | null = new Image();

    // img.crossOrigin = "anonymous"; // 必须在设置 src 之前
    img.referrerPolicy = "no-referrer-when-downgrade";
    img.decoding = "async";

    img.src = url;
    if (img.complete) {
      // console.log("图片信息获取-->成功!");
      meta = new Meta({
        valid: true,
        width: img.width,
        height: img.height,
        type: "image",
        ext: getExtByUrl(url),
      });
      img = null; // s 用完后释放img对象
      resolve(meta);
    } else {
      img.addEventListener(
        "load",
        function () {
          // console.log("图片信息获取-->成功!");
          meta = new Meta({
            valid: true,
            width: this.width,
            height: this.height,
            type: "image",
            ext: getExtByUrl(url),
          });
          img = null; // s 用完后释放img对象
          resolve(meta);
        },
        { once: true },
      );
      const onError = function (_e: Event) {
        // console.log("图片信息获取-->失败!", e);
        meta = new Meta({
          ext: getExtByUrl(url),
          type: "image", // 失败也需要设置为 image 类型
        });
        img = null; // s 用完后释放img对象
        resolve(meta);
      };
      img.addEventListener("error", onError, { once: true });
      img.addEventListener("abort", onError, { once: true });
      img.addEventListener("cancel", onError, { once: true });
    }
  });
}
