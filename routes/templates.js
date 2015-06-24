var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.render('index', { title: 'Hey'});
});

// server ng-view files
router.get('/templates/:filename', function(req, res){
  var filename = req.params.filename;
  res.render("templates/" + filename);
});

router.get('/directives/:filename', function(req, res){
  var filename = req.params.filename;
  res.render("directives/" + filename);
});

module.exports = router;