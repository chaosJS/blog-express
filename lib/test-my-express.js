const myExpress = require('./my-express');
const app = myExpress();
const testMiddleware1 = (req, res, next) => {
	console.log('req start...', req.method, req.url);
	next();
};
app.use(testMiddleware1);
app.use((req, res, next) => {
	req.cookie = {
		userId: 'abc',
	};
	next();
});
app.use((req, res, next) => {
	setTimeout(() => {
		req.body = {
			a: 100,
			b: 200,
		};
		next();
	}, 1000);
});
app.use('/test', (req, res, next) => {
	console.log('handle /test ');
	next();
});
app.get('/test', (req, res, next) => {
	console.log('get /test ');
	next();
});
app.post('/test', (req, res, next) => {
	console.log('post /test ');
	next();
});

const checkLogin = (req, res, next) => {
	setTimeout(() => {
		console.log('模拟登陆成功');
		next();
	}, 2000);
};
app.get('/test/get-cookie', checkLogin, (req, res, next) => {
	console.log('get /test/get-cookie ');
	res.json({
		success: true,
		data: req.cookie,
	});
});

app.post('/test/get-post-data', (req, res, next) => {
	console.log('post /test/get-post-data ');
	res.json({
		success: true,
		data: req.body,
	});
});

app.listen(9999, () => {
	console.log('test my expree on port 9999');
});
