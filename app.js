var createError = require('http-errors');
var express = require('express');
var path = require('path');
const fs = require('fs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expresSession = require('express-session');
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var usersRouter = require('./routes/users');
var blogRouter = require('./routes/blog');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// dev means method url status res-time res-content-length
// combined/short/tiny ect each have diiiferent format log
// app.use(logger('dev', {}));
const logFileName = path.join(__dirname, 'logs', 'access.log');
const ws = fs.createWriteStream(logFileName, {
	// a means append
	flags: 'a',
});
app.use(
	logger('combined', {
		stream: ws,
	})
);

//add  post data in req.body
app.use(express.json());
// add form data in req.body
app.use(express.urlencoded({ extended: false }));
// add cookie in req ,so we can use req.cookie
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// add express session middleware
const RedisStore = require('connect-redis')(expresSession);
const redisClient = require('./db/redis');
const sessionStore = new RedisStore({
	client: redisClient,
});
app.use(
	expresSession({
		secret: 'SXsdw2#',
		resave: false,
		saveUninitialized: true,
		cookie: {
			// default
			path: '/',
			// 10秒有效期
			maxAge: 60 * 1000,
			// https
			// secure: true,
			// default
			httpOnly: true,
		},
		// 60 s 内重复刷新 重新设置max age
		rolling: true,
		store: sessionStore,
	})
);
/** 
// const testMiddleware1 = (req, res, next) => {
// 	console.log('req start...', req.method, req.url);
// 	next();
// };
// app.use(testMiddleware1);
// app.use((req, res, next) => {
// 	req.cookie = {
// 		userId: 'abc',
// 	};
// 	next();
// });
// app.use((req, res, next) => {
// 	setTimeout(() => {
// 		req.body = {
// 			a: 100,
// 			b: 200,
// 		};
// 		next();
// 	}, 1000);
// });
// app.use('/test', (req, res, next) => {
// 	console.log('handle /test ');
// 	next();
// });
// app.get('/test', (req, res, next) => {
// 	console.log('get /test ');
// 	next();
// });
// app.post('/test', (req, res, next) => {
// 	console.log('post /test ');
// 	next();
// });

// const checkLogin = (req, res, next) => {
// 	setTimeout(() => {
// 		console.log('模拟登陆成功');
// 		next();
// 	}, 2000);
// };
// app.get('/test/get-cookie', checkLogin, (req, res, next) => {
// 	console.log('get /test/get-cookie ');
// 	res.json({
// 		success: true,
// 		data: req.cookie,
// 	});
// });

// app.post('/test/get-post-data', (req, res, next) => {
// 	console.log('post /test/get-post-data ');
// 	res.json({
// 		success: true,
// 		data: req.body,
// 	});
// });
// app.use((req, res, next) => {
// 	console.log('handle 404 ');
// 	res.json({
// 		success: false,
// 		msg: '404 not found',
// 	});
// });
*/
app.use('/', indexRouter);
app.use('/login', loginRouter);

app.use('/api/users', usersRouter);
app.use('/api/blog', blogRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
