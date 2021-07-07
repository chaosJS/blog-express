const http = require('http');
const slice = Array.prototype.slice;
class MyExpress {
	constructor() {
		this.routes = {
			//  app.use(()=>{}) 存放用app.use 注册的中间件
			all: [],
			// app.get('/api',()=>{}) 存放用app.get 注册的中间件
			get: [],
			// app.post('/api',()=>{})存放用app.post 注册的中间件
			post: [],
		};
	}
	register(path) {
		const info = {};
		if (typeof path === 'string') {
			// app.use('/xxx',mFn1, mFn2)
			info.path = path;
			// 取出 mFn1, mFn2 ...
			info.stack = slice.call(arguments, 1);
			/**
			 * {
			 *    path:'/xxx',
			 *    stack: [ mFn1, mFn2 ]
			 * }
			 */
		} else {
			// app.use(()=>{},mFn3, ...)
			info.path = '/';
			info.stack = slice.call(arguments, 0);
			/**
			 * {
			 *    path:'/',
			 *    stack: [ ()=>{}, mFn3, .... ]
			 * }
			 */
		}

		return info;
	}
	use() {
		// 调用 register
		// app.use('/xxx',mFn1, mFn2)
		// arguments 包括 '/xxx',mFn1, mFn2  此时info为
		/**
		 * {
		 *    path:'/xxx',
		 *    stack: [ mFn1, mFn2 ]
		 * }
		 */
		const info = this.register.apply(this, arguments);
		// push 进 routes.all 中
		this.routes.all.push(info);
	}
	get() {
		const info = this.register.apply(this, arguments);
		// push 进 routes.get 中
		this.routes.get.push(info);
	}
	post() {
		const info = this.register.apply(this, arguments);
		// push 进 routes.post 中
		this.routes.post.push(info);
	}

	// 匹配路由对应的中间件
	match(url, method) {
		let stack = [];
		// 忽略favicon.ico
		if (url === '/favicon.ico') {
			return stack;
		}

		// 获取routes
		const currentRoutes = [
			// 通过use注册的中间件函数都需要
			...this.routes.all,
			// 添加符合 method 的中间件函数
			...this.routes[method],
		];
		/**
		 * [
		 *   {
		 *        path:'/',
		 *        stack: [ ()=>{}, mFn3, .... ]
		 *    },
		 *    {
		 *        path:'/xxx',
		 *        stack: [ mFn1, mFn2 ]
		 *    },
		 *    ....
		 * ]
		 */
		currentRoutes.forEach((routeInfo) => {
			if (url.indexOf(routeInfo.path) === 0) {
				// url = '/api/get-cookie';
				// path = '/' || '/api' || '/api/get-cookie';
				//假设 url 匹配上了。 实际上url的匹配更为复杂
				stack = [...stack, ...routeInfo.stack];
			}
		});
		// 匹配到/xxx 此时stack = [ mFn1, mFn2 ]
		return stack;
	}
	// callback
	callback() {
		return (req, res) => {
			res.json = (data) => {
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(data));
			};

			const url = req.url;
			const method = req.method.toLowerCase();
			// 通过url和method区分调用哪个routes 的中间件函数
			const resultList = this.match(url, method);
			this.handle(req, res, resultList);
		};
	}
	// 核心的next机制 在这里执行匹配到的stack中的中间件
	handle(req, res, stack) {
		const next = () => {
			// 拿到待执行的中间件 mFn1  =  (req,res,next)=>{}
			const middleware = stack.shift();
			if (middleware) {
				middleware(req, res, next);
			}
		};
		next();
	}
	// app.listen(()=>{})
	listen(...args) {
		// http.createServer((req, res) => {
		//   res.writeHead(200, {'Content-Type': 'text/plain'});
		//   res.write('Hello World!');
		//   res.end();
		// });
		// 需要传入一个回调函数
		const server = http.createServer(this.callback());
		server.listen(...args);
	}
}
// 工厂函数
module.exports = () => {
	return new MyExpress();
};
