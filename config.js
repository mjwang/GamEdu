var express = require('express');
var body_parser = require('body-parser');
var cookie_parser = require('cookie-parser');
var express_session = require('express-session');

var mongoose = require('mongoose');

require('./schema.js');

module.exports = function config(app){

  app.use("/css", express.static(__dirname + "/css"));
  app.use("/views", express.static(__dirname + "/views"));

  app.use(body_parser());
  app.use(cookie_parser());
  app.use(express_session({secret: "gamedu sec"}));

  mongoose.connect('mongodb://localhost/mydb');
  var db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function(){
    console.log('Connected to mongodb');
  });
}

