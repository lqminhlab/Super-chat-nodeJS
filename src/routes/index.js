var express = require('express');
var router = express.Router();
var path = require('path');

var auth_controller = require('../controller/auth-controller');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});
  
router.get('/login', auth_controller.login_get); 

router.post('/login', auth_controller.login_post);

router.get('/register', auth_controller.register_get);

router.post('/register', auth_controller.register_post);

module.exports = router;
