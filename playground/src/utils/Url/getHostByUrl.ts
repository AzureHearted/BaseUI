/**
 * f 获取链接中的域名
 * @param {string} url 链接
 * @returns {string} 链接对应的域名
 */
export function getHostByUrl(url: string): string {
	const list = url.match(/(https?:\/\/[^/]+(?=\/))/g) || [];
	if (list.length > 0) {
		return list[0] || url;
	} else {
		return url;
	}
}
