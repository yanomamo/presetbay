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
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var favicon = require('serve-favicon');
//var minify = require('express-minify');

var templates = require('./routes/templates');
var presets = require('./routes/presets');
var users = require('./routes/users');
var vote = require('./routes/vote');

// switch when live
// mongoose.connect(mongodb://yanomamo:blackbelt@ds047752.mongolab.com:47752/presetbaydb);
mongoose.connect('mongodb://127.0.0.1/mydb');     // connect to mongoDB database on modulus.io

// compile main less file
less.render(fs.readFileSync("./public/style.less").toString(), {
  filename: path.resolve("./public/style.less")
}, function(e, output) {
  fs.writeFileSync("./public/style.css", output.css, 'utf8');
});

// compile faq less file
less.render(fs.readFileSync("./public/stylefaq.less").toString(), {
  filename: path.resolve("./public/stylefaq.less")
}, function(e, output) {
  fs.writeFileSync("./public/faq/stylefaq.css", output.css, 'utf8');
});

// set apps
app.set('views', './views')
app.set('view engine', 'jade')
app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(cookieParser());
app.use(session({
    secret: 'foo',
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
    //rolling: true, // updates from db upon each request
    //resave: true,
}));
//app.use(minify());
app.use(methodOverride());

app.use('/', templates);
app.use('/api/presets', presets);
app.use('/api/users', users);
app.use('/api/vote', vote);

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");
