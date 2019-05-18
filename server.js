'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var expect = require('chai').expect;
var cors = require('cors');

var apiRoutes = require('./routes/api.js');
var fccTestingRoutes = require('./routes/fcctesting.js');
var runner = require('./test-runner');
const port = process.env.PORT || 3000;
const helmet = require('helmet');
const hbs = require('./handler');
var app = express();

app.use('/public', express.static(process.cwd() + '/public'));

// Helmet config
app.use(
  helmet({
    noCache: true,
    hidePoweredBy: { setTo: 'PHP 4.2.0' },
    xssFilter: true,
    directives: { defaultSrc: ["'self'"] }
  })
);

app.use(cors());

// Express Handlebars
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Index page (static HTML)
app.route('/').get(function(req, res) {
  res.render('index');
});

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API
apiRoutes(app);

//404 Not Found Middleware
app.use(function(req, res, next) {
  res
    .status(404)
    .type('text')
    .send('Not Found');
});

//Start our server and tests!
app.listen(port, function() {
  console.log('Listening on port ' + port);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(function() {
      try {
        runner.run();
      } catch (e) {
        var error = e;
        console.log('Tests are not valid:');
        console.log(error);
      }
    }, 3500);
  }
});

module.exports = app; //for testing
