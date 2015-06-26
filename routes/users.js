var express = require('express');
var mongoose = require('mongoose');
var md5 = require('MD5');
var router = express.Router();

var Users = mongoose.model('Users', {
  username: String,
  password: String,
  uploads: [mongoose.Schema.Types.ObjectId],
  downloads: [mongoose.Schema.Types.ObjectId]
});

router.get('/search/:username', function (req, res) {
  var name = req.params.username;

  Users.find({
    username: new RegExp(name, "i")
  }, function(err, users) {

    if (err)
      res.send(err)
    res.send(users);
  });
});

router.post('/login', function(req, res) {
  Users.findOne({
    username: req.body.username,
    password: md5(req.body.password)
  }, function(err, user) {

    if (err)
      res.send(err)
    else if (user == null)
      res.json({
        error: 'User not found'
      });
    else {
      req.session.user = user;
      res.json(user);
    }
  });
});

// make new user
router.post('/', function(req, res) {

  // check if user exists already
  Users.findOne({
    username: req.body.username
  }, function (err, user) {
    if (err)
      res.send(err)
    
    if (user != null) {
      res.json({
        error: 'Username taken'
      })
    } else {
      Users.create({
        username: req.body.username,
        password : md5(req.body.password),
        uploads: [],
        downloads: []
      }, function(err, newUser) {
        if (err)
          res.send(err);

        //user just created, so update their session
        req.session.user = newUser;
        res.json(newUser);
      });
    }
  })
});

router.get('/sessionUser', function (req, res) {
  if (req.session.user)
    res.json(req.session.user);
  else
    res.send();
});

/*
router.post('/sessionUpdate', function (req, res) {
  req.session.user = req.username;
  res.send();
})*/

router.post('/sessionDelete', function (req, res) {
  req.session.destroy();
  res.clearCookie('connect.sid')
  res.send();
})

module.exports = router;