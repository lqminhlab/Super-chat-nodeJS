var express = require('express');
var router = express.Router();
var path = require('path');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send({"status": true, "msg": "Success!", "data": []});
});

module.exports = router;
