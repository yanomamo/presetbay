var express = require('express');
var mongoose = require('mongoose'); 
var router = express.Router();

var Presets = mongoose.model('Presets', {
    name: String,
    fileType : String,
    fileBase64: String
    //tags: [String],
    //downloadCount: Number,
    //owner: Schema.Types.ObjectId
});

router.get('/', function(req, res) {
  // use mongoose to get all todos in the database
  Presets.find(function(err, preset) {

    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err)
        res.send(err)

    res.json(preset); // return all todos in JSON format
  });
});

// searching by tags UNFINISHED
router.get('/:tag1/:tag2/:tag3', function(req, res) {
  // use mongoose to get all todos in the database
  Presets.find(function(err, preset) {

    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err)
        res.send(err)

    res.json(preset); // return all todos in JSON format
  });
});


// create todo and send back all todos after creation
router.post('/', function(req, res) {

  // create a todo, information comes from AJAX request from Angular
  Presets.create({
    name: req.body.name,
    fileType : req.body.extension,
    fileBase64: req.body.file,
    done : false
  }, function(err, preset) {
    if (err)
      res.send(err);

    // get and return all the todos after you create another
    Presets.find(function(err, preset) {
      if (err)
        res.send(err)
      res.json(preset);
    });
  });

});

// delete a todo
router.delete('/:preset_id', function(req, res) {
  Presets.remove({
    _id : req.params.preset_id
  }, function(err, preset) {
    if (err)
      res.send(err);

    // get and return all the todos after you create another
    Presets.find(function(err, preset) {
      if (err)
        res.send(err)
      res.json(preset);
    });
  });
});

module.exports = router;