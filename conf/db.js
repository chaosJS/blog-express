const isProd = process.env.NODE_ENV === 'production';
let REDIS_CONF = {
	// depends on isProd change the conf
	host: '127.0.0.1',
	port: '6379',
};
let MYSOL_CONF = {
	// depends on isProd change the conf
	host: 'localhost',
	user: 'root',
	password: 'Lichao7712',
	port: '3306',
	database: 'my_blog',
};

module.exports = {
	MYSOL_CONF,
	REDIS_CONF,
};
