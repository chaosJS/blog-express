var express = require('express');
var router = express.Router();
const { userLogin } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resModel');
router.post('/login', (req, res, next) => {
	const { username, password } = req.body;
	const result = userLogin(username, password);
	result.then((loginData) => {
		if (loginData.username) {
			// set session
			req.session.username = loginData.username;
			req.session.realname = loginData.realname;
			res.json(new SuccessModel(true, 'login success'));
		} else {
			res.json(new ErrorModel('login fail'));
		}
	});
});
// router.get('/session-test', (req, res, next) => {
// 	const { session } = req;

// 	if (!session.viewNum) {
// 		session.viewNum = 0;
// 	}
// 	session.viewNum++;
// 	res.json({
// 		data: session.viewNum,
// 		sss: session,
// 	});
// });
module.exports = router;
