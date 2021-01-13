var express = require('express');
var router = express.Router();
var auth = require('../middleware/auth');

var authController = require('../controller/auth-controller');
var friendController = require('../controller/friend-controller');
var conversationController = require('../controller/conversation-controller');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send({"status": true, "msg": "Success!", "data": {}});
});

router.post('/login', authController.login_post);

router.post('/register', authController.register_post);

// ====== Auth=========

router.post('/me', auth.verified, authController.me_post);

router.post('/friends', auth.verified, friendController.getFriends);

router.post('/search-friend', auth.verified, friendController.searchFriends);

router.post('/conversations', auth.verified, conversationController.getConversations);

module.exports = router;
