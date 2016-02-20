var express = require('express');
var router = express.Router();
var path = require ('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{});
});

router.get('/results', function(req, res, next) {
  res.render('results', {});
});

module.exports = router;
