var express = require('express');
var mongoose = require('mongoose'); 
var router = express.Router();
var presetReturnLimit = 150;

var Presets = mongoose.model('Presets', {
    name: String,
    fileType : String,
    fileBase64: String,
    tags: [String],
    downloadCount: Number,
    owner: mongoose.Schema.Types.ObjectId,
    ownerName: String
});

// get presets by name
router.get('/all/:app', function (req, res) {

  var app = req.params.app;

  if (app == 'Massive') {
    var type = '.nmsv';
  } else {
    var type = '.fxp';
  }

  Presets
  .find({
    fileType: type
  })
  .sort({
    downloadCount: 'desc'
  })
  .limit(presetReturnLimit)
  .exec(function(err, presets) {
    if (err)
      res.send(err)

    res.send(presets);
  });
});

router.post('/name', function (req, res) {
  var name = req.body.name;
  var app = req.body.app;

  if (app == 'Massive') {
    var type = '.nmsv';
  } else {
    var type = '.fxp';
  }

  Presets
  .find({
    name: new RegExp(name, "i"),
    fileType: type
  })
  .sort({
    name: 'asc'
  })
  .limit(presetReturnLimit)
  .exec(function(err, presets) {
    if (err)
      res.send(err)

    res.send(presets);
  });
});

// get presets by name
router.post('/tags', function(req, res) {

  var app = req.body.app;

  if (app == 'Massive') {
    var type = '.nmsv';
  } else {
    var type = '.fxp';
  }

  // for library UPDATE
  if (req.body.ids) {
    Presets
    .find({
      tags: { $in : req.body.tags },
      _id: {$in : req.body.ids},
      fileType: type
    })
    .sort({
      name: 'asc'
    })
    .limit(presetReturnLimit)
    .exec(function(err, presets) {
      if (err)
        res.send(err)

      res.send(presets);
    });

  } else {

    // for search
    Presets
    .find({
      tags: { $in : req.body.tags },
      fileType: type
    })
    .sort({
      name: 'asc'
    })
    .limit(presetReturnLimit)
    .exec(function(err, presets) {
      if (err)
        res.send(err)

      res.send(presets);
    });
    
  }
});

// get presets by user array
router.post('/getUserDownloads', function (req, res) {
  Presets.find({
    _id: {$in: req.body.downloads}
  }, function(err, presets) {
   if (err)
        res.send(err)

    res.send(presets); // return all todos in JSON format
  });
})

// Create preset in db
router.post('/', function(req, res) {

  // too big to be an nmsv file... This doesnt work though :P
  // if (req.body.file.length > 6000) {
  //   res.status(404).send("That file was too big to be a preset");
  // }

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

  Presets
  .find({
    _id: {$in: ids},
    owner: userId
  })
  .sort({
    name: 'asc'
  })
  .limit(presetReturnLimit)
  .exec(function(err, presets) {
    if (err)
      res.send(err)

    res.send(presets);
  });

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

  var app = req.body.app;

  if (app == 'Massive') {
    var type = '.nmsv';
  } else {
    var type = '.fxp';
  }

  Presets
  .find({
    _id: {$in: req.body.ids},
    name: new RegExp(req.body.name, "i"),
    fileType: type
  })
  .sort({
    name: 'asc'
  })
  .limit(presetReturnLimit)
  .exec(function(err, presets) {
    if (err)
      res.send(err)

    res.send(presets);
  });

})

router.get('/count', function(req, res) {
  Presets.count({}, function(err, count) {
    if (err)
      res.send(err)
    res.send({
      count: count
    });
  })
})

module.exports = router;