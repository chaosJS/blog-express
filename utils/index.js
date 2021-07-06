const crypto = require('crypto');
const getPostData = (req) => {
	return new Promise((reslove) => {
		if (
			req.method !== 'POST' ||
			!req.headers['content-type'].includes('application/json')
		) {
			// 非post请求或者 请求格式不为'application/json' 返回空
			reslove({});
			return;
		}
		let postData = ``;
		req.on('data', (chunk) => {
			postData += chunk;
		});
		req.on('end', () => {
			if (!postData) {
				reslove({});
				return;
			}
			reslove(JSON.parse(postData));
		});
	});
};
const parseCookieStr = (cookieStr) => {
	const cookieObj = {};
	cookieStr.split(';').forEach((item) => {
		if (!item) {
			return;
		}
		const key = item.split('=')[0].trim();
		const value = item.split('=')[1].trim();
		cookieObj[key] = value;
	});
	return cookieObj;
};
const getCookieExpires = () => {
	// set one day expires time
	const d = new Date();
	d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
	return d.toGMTString();
};

// 	保管好
const SECRET_KEY = 'WAKTR_$1da#';
const genPassword = (password) => {
	const pwdStr = `password=${password}&key=${SECRET_KEY}`;
	let md5 = crypto.createHash('md5');
	return md5.update(pwdStr).digest('hex');
};
module.exports = {
	getPostData,
	parseCookieStr,
	getCookieExpires,
	genPassword,
};
