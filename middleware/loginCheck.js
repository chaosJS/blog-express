const { SuccessModel, ErrorModel } = require('../model/resModel');
module.exports = (req, res, next) => {
	if (req.session.username) {
		next();
	} else {
		res.json(new ErrorModel('not login'));
	}
};
