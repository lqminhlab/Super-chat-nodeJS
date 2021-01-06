var express = require('express');
var router = express.Router();
var auth = require('../middleware/auth');

var auth_controller = require('../controller/auth-controller');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send({"status": true, "msg": "Success!", "data": {}});
});

router.post('/me', auth.verified, auth_controller.me_post);

router.post('/login', auth_controller.login_post);

router.post('/register', auth_controller.register_post);

module.exports = router;
