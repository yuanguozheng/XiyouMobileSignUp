
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var submit  = require('./routes/submit');
var http = require('http');
var path = require('path');
var user = require('./routes/user');
var verify = require('./routes/verify');
var getAll = require('./routes/getAll');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/submit',submit.userInfoSubmit);
app.post('/getUser',user.getUser);
app.post('/verify',verify.verify);
app.post('/getAll',getAll.getAll);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
