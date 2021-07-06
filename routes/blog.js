var express = require('express');
var router = express.Router();
const {
	getBlogList,
	getBlogDetail,
	newBlog,
	updataBlog,
	delBlog,
	getPromiseData,
} = require('../controller/blog');
const loginCheck = require('../middleware/loginCheck');
const { SuccessModel, ErrorModel } = require('../model/resModel');
router.get('/list', loginCheck, (req, res, next) => {
	const { author, keyword } = req.query;
	getBlogList(author, keyword).then((blogList) => {
		res.json(new SuccessModel(blogList));
	});
});
router.get('/detail', loginCheck, (req, res, next) => {
	const { id } = req.query;
	const blogRes = getBlogDetail(id);
	blogRes.then((blogDetail) => {
		if (blogDetail) {
			res.json(new SuccessModel(blogDetail));
		} else {
			res.json(new ErrorModel('no blog detail'));
		}
	});
});
module.exports = router;
