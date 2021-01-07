var express = require('express');
var router = express.Router();
var auth = require('../middleware/auth');

var authController = require('../controller/auth-controller');
var friendController = require('../controller/friend-controller');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send({"status": true, "msg": "Success!", "data": {}});
});

router.post('/login', authController.login_post);

router.post('/register', authController.register_post);

// ====== Auth=========

router.post('/me', auth.verified, authController.me_post);

router.post('/friends', auth.verified, friendController.postFriends);

router.post('/search-friend', auth.verified, friendController.searchFriends);

module.exports = router;
