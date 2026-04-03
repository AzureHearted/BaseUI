import { Meta } from "../../models/Meta";
import { getExtByUrl } from "../Url/getExtByUrl";

// 通过Video对象获取视频meta
export function getMetaByVideo(url: string): Promise<Meta> {
	if (!url || !url.trim().length) {
		console.log("链接无效", url);
		const errMeta: Meta = new Meta();
		return Promise.resolve(errMeta);
	}
	let meta: Meta;
	return new Promise((resolve) => {
		const video = document.createElement("video");
		video.onloadedmetadata = function () {
			// 获取视频宽度和高度
			const width = video.videoWidth;
			const height = video.videoHeight;
			// 释放资源
			URL.revokeObjectURL(video.src);
			resolve(
				new Meta({
					width,
					height,
					ext: getExtByUrl(url),
					type: "video",
					valid: true,
				}),
			);
		};
		video.onerror = function () {
			meta = new Meta({
				ext: getExtByUrl(url),
			});
			resolve(meta);
		};

		video.src = url;
		video.load();
	});
}
