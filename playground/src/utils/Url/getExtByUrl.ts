import { getNameByUrl } from "./getNameByUrl";

// f 提取链接扩展名
export function getExtByUrl(url: string): string {
	let ext = "";
	const name = getNameByUrl(url);
	const match = /(?<=\.)[^.]+$/.exec(name);
	if (match) {
		ext = match[0];
	}
	// 特殊情况处理
	if (ext === "jpeg") ext = "jpg";
	return ext;
}
