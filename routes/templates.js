var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.render('index', { title: 'PresetBay'});
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

router.get('/faq', function(req, res) {
  res.render('faq', {title: 'PB - FAQ'})
})

module.exports = router;