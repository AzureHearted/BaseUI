/**
 * f [功能封装] 通过url获取名称
 * @param {string} url 链接
 * @returns {string} 链接的名称部分
 */
export function getNameByUrl(url: string): string {
	url = decodeURI(url);
	// 先尝试转为URL对象
	let urlObj: URL;
	try {
		urlObj = new URL(url);
	} catch {
		// 如果不是url则替换掉所有“/”“\”后返回
		return url.replace(/[/\\]/, "-");
	}
	// 去除查询参数和结尾的“/”
	url = url.replace(/([/\\])$/, "").replace(urlObj.search, "");
	const list = url.match(/(?<=[/\\]+)([^\\/\r\n$]+)$/g) || [];
	if (list.length > 0) {
		return list[0] || url;
	} else {
		return url;
	}
}
