import { Meta } from "../../models/Meta";
import { inferUrlType } from "../inferUrlType";
import { getMetaByImage } from "./getMetaByImage";
import { getMetaByVideo } from "./getMetaByVideo";

// 获取元信息(通过url)
export async function getMetaByUrl(url: URL, defaultMeta?: Partial<Meta>) {
	// meta初始值
	let meta = new Meta();

	meta = new Meta({ ...meta, ...defaultMeta });

	// 先推断链接类型
	const inferType = inferUrlType(url);

	if (inferType === "image") {
		// s 处理图片类型
		const res = await getMetaByImage(url.href);
		// console.log(`${url.href},推断为image，getMetaByImage结果`, res);
		res.ext = meta.ext || res.ext;
		meta = new Meta({ ...meta, ...res });
	} else if (inferType === "video") {
		// s 处理视频类型
		const res = await getMetaByVideo(url.href);
		res.ext = meta.ext || res.ext;
		meta = new Meta({ ...meta, ...res });
	} else {
		// s 其他类型
		meta = new Meta({
			...meta,
			type: inferType,
		});
	}

	return meta;
}
