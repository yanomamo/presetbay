var express = require('express');
var mongoose = require('mongoose');
var md5 = require('MD5');
var router = express.Router();
var userReturnLimit = 100;

var Users = mongoose.model('Users', {
  username: String,
  password: String,
  uploads: [mongoose.Schema.Types.ObjectId],
  downloads: [mongoose.Schema.Types.ObjectId],
  info: {
    bio: String,
    links: [{
      title: String,
      address: String
    }]
  }
});

function updateSessionUser(id, callback) {
  Users.findOne({
    _id: id
  }, function(err, user) {
    if (err)
      console.log(err);
    callback(user);
  });
}

router.get('/searchId/:id', function (req, res) {
  var id = req.params.id;

  Users.findOne({
    _id: id
  }, function(err, user) {

    if (err)
      res.send(err)
    res.send(user);
  });
});

router.get('/search/:username', function (req, res) {
  var name = req.params.username;

  Users
  .find({
    username: new RegExp(name, "i")
  })
  .sort({
    username: 'asc'
  })
  .limit(userReturnLimit)
  .exec(function(err, users) {
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

router.post('/updateDownloads', function(req, res) {
  Users.update({
    _id: req.body._id,
  },
  {
    $addToSet: {
      downloads: req.body.presetId
    }
  }, function(err, num) {

    if (err){
      console.log(err);
    }

    // anytime the user is updated, the session user must reflect that change
    if (req.session.user){
      updateSessionUser(req.session.user._id, function(user) {
        req.session.user = user;
        res.send({});
      })
    } else {
      res.send({});
    }
  });
});

router.post('/updateUploads', function (req, res) {
  Users.update({
    _id: req.body._id,
  },
  {
    $addToSet: {
      uploads: {
        $each: req.body.presetIds
      }
    }
  }, function(err, num) {

    if (err){
      console.log(err);
    }

    // anytime the user is updated, the session user must reflect that change
    if (req.session.user){
      updateSessionUser(req.session.user._id, function(user) {
        req.session.user = user;
        res.send({});
      })
    } else {
      res.send({});
    }
  });
});

router.post('/updateDescription', function (req, res) {
  Users.update({
    _id: req.body._id,
  },{
    $set: {
       'info.bio': req.body.info
    }
  }, function(err, num) {

    if (err){
      console.log(err);
    }

    // anytime the user is updated, the session user must reflect that change
    if (req.session.user){
      updateSessionUser(req.session.user._id, function(user) {
        req.session.user = user;
        res.send({});
      })
    } else {
      res.send({});
    }
  });
});

router.post('/updateLink', function (req, res) {

  var link = req.body.link;

  Users.update({
    _id: req.body._id,
  },{
    $addToSet: {
       'info.links': link
    }
  }, function(err, num) {

    if (err){
      console.log(err);
    }

    // anytime the user is updated, the session user must reflect that change
    if (req.session.user){
      updateSessionUser(req.session.user._id, function(user) {
        req.session.user = user;
        res.send({});
      })
    } else {
      res.send({});
    }
  });
});

router.post('/deleteLink', function (req, res) {
  
  var link = req.body.link;

  Users.update({
    _id: req.body._id
  },{
     $pull: { 
      'info.links': link
    }
  }, function(err, num) {

    if (err){
      console.log(err);
    }

    // anytime the user is updated, the session user must reflect that change
    if (req.session.user){
      updateSessionUser(req.session.user._id, function(user) {
        req.session.user = user;
        res.send({});
      })
    } else {
      res.send({});
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
        downloads: [],
        info: {
          bio: "",
          links: []
        }
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

router.post('/sessionDelete', function (req, res) {
  req.session.destroy();
  res.clearCookie('connect.sid')
  res.send();
})

module.exports = router;