var express = require('express');
var mongoose = require('mongoose'); 
var router = express.Router();

var Presets = mongoose.model('Presets', {
    name: String,
    fileType : String,
    fileBase64: String,
    tags: [String],
    downloadCount: Number,
    owner: mongoose.Schema.Types.ObjectId,
    ownerName: String
});

// router.get('/', function(req, res) {
//   // use mongoose to get all todos in the database
//   Presets.find(function(err, preset) {

//     // if there is an error retrieving, send the error. nothing after res.send(err) will execute
//     if (err)
//         res.send(err)

//     res.json(preset); // return all todos in JSON format
//   });
// });

router.get('/name/:preset_name', function (req, res) {
  var name = req.params.preset_name;

  Presets.find({
    name: new RegExp(name, "i")
  }, function(err, presets) {
    if (err)
      res.send(err)

    res.send(presets);
  })
});

router.post('/tags', function(req, res) {
  // use mongoose to get all todos in the database
  if (req.body.ids) {
    Presets.find({
      tags: { $in : req.body.tags },
      _id: {$in : req.body.ids}
    },function(err, presets) {

      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err)
          res.send(err)

      res.json(presets); // return all todos in JSON format
    });
  } else {
    Presets.find({
      tags: { $in : req.body.tags }
    },function(err, presets) {
      if (err)
          res.send(err)
      res.json(presets); // return all todos in JSON format
    });
  }
});

router.post('/getUserDownloads', function (req, res) {
  Presets.find({
    _id: {$in: req.body.downloads}
  }, function(err, presets) {

    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err)
        res.send(err)

    res.send(presets); // return all todos in JSON format
  });
})

router.post('/', function(req, res) {

  // create a todo, information comes from AJAX request from Angular
  Presets.create({
    name: req.body.name,
    fileType : req.body.extension,
    tags: req.body.tags,
    downloadCount: 0,
    owner: req.body.owner,
    ownerName: req.body.ownerName,
    fileBase64: req.body.file
  }, function(err, preset) {
    if (err)
      res.send(err);

    res.json(preset);
  });

});

router.post('/searchByUser', function(req, res) {
  var ids = req.body.presetIds;
  var userId = req.body.userId;
  console.log(ids);
  console.log(userId);

  //find presets in the array with that owner
  Presets.find({
    _id: {$in: ids},
    owner: userId
  }, function (err, presets) {
    if (err)
      res.send(err)
    res.send(presets);
  })
})

router.post('/downloaded', function (req, res) {
  Presets.update({
    _id: req.body._id
  }, {
    $inc: {
      downloadCount: 1
    }
  }, function(err, num) {

    if (err){
      console.log(err);
    }
    res.send({});
  })
});

router.post('/query', function (req, res) {
  Presets.find({
    _id: {$in: req.body.ids},
    name: new RegExp(req.body.name, "i")
  }, function (err, presets) {
    if (err)
      res.send(err)
    res.send(presets);
  })
})

// delete a todo
// router.delete('/:preset_id', function(req, res) {
//   Presets.remove({
//     _id : req.params.preset_id
//   }, function(err, preset) {
//     if (err)
//       res.send(err);

//     // get and return all the todos after you create another
//     Presets.find(function(err, preset) {
//       if (err)
//         res.send(err)
//       res.json(preset);
//     });
//   });
// });

module.exports = router;