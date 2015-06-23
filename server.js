// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var less = require('less');
var fs   = require('fs');
var path = require('path');

// configure the database
mongoose.connect('mongodb://127.0.0.1/mydb');     // connect to mongoDB database on modulus.io

// compile less file
less.render(fs.readFileSync("./public/style.less").toString(), {
  filename: path.resolve("./public/style.less")
}, function(e, output) {
  fs.writeFileSync("./public/style.css", output.css, 'utf8');
});

// set apps
app.set('views', './views')
app.set('view engine', 'jade')
app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// define model =================
var Presets = mongoose.model('Presets', {
    name: String,
    fileType : String,
    fileBase64: String
    //tags: [String],
    //downloadCount: Number,
    //owner: Schema.Types.ObjectId
});

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");

// Router

app.get('/api/presets', function(req, res) {

  // use mongoose to get all todos in the database
  Presets.find(function(err, preset) {

    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err)
        res.send(err)

    res.json(preset); // return all todos in JSON format
  });
});

// create todo and send back all todos after creation
app.post('/api/presets', function(req, res) {

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
app.delete('/api/presets/:preset_id', function(req, res) {
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

app.get('/', function (req, res) {
  res.render('index', { title: 'Hey'});
});





