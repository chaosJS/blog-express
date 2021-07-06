var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	if (req.session.username) {
		res.json(req.session);
	} else {
		res.send(`
    <form action="/api/users/login" method="post">
    <p>First name: <input type="text" name="username" /></p>
    <p>Last name: <input type="password" name="password" /></p>
    <input type="submit" value="Submit" />
  </form>
    `);
	}
});

module.exports = router;
