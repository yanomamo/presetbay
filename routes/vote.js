var express = require('express');
var mongoose = require('mongoose'); 
var router = express.Router();
var voteId = "55af43e0093f522da72603b1"// update

var Votes = mongoose.model('Vote', {
    fm8: Number,
    syl : Number,
    nex: Number,
    unk: Number,
    alt: [String]
});

router.get('/', function(req, res) {
  Votes.findOne({
    _id: voteId
  }, function(err, vote) {
    if (err)
      console.log(err);
    res.send(vote);
  });
})

// get presets by name
router.post('/', function (req, res) {

  if (req.body.vote.fm8) {
    Votes.update({
      _id: voteId
    }, {
      $inc: {
        fm8: 1
      }
    }, function(err, num) {
      
    })
  }

  if (req.body.vote.syl) {
    Votes.update({
      _id: voteId
    }, {
      $inc: {
        syl: 1
      }
    }, function(err, num) {
      
    })
  }

  if (req.body.vote.nex) {
    Votes.update({
      _id: voteId
    }, {
      $inc: {
        nex: 1
      }
    }, function(err, num) {
      
    })
  }

  if (req.body.vote.unk) {
    Votes.update({
      _id: voteId
    }, {
      $push: {
        alt: req.body.alternate
      },
      $inc: {
        unk: 1
      }
    }, function(err, num) {
      
    })
  }

  Votes.findOne({
    _id: voteId
  }, function(err, vote) {
    if (err)
      console.log(err);
    res.send(vote);
  });

});


module.exports = router;