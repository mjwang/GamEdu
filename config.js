var express = require('express');
var body_parser = require('body-parser');
var cookie_parser = require('cookie-parser');
var express_session = require('express-session');
var mongoose = require('mongoose');
var path = require('path');


module.exports = function config(app){

  app.use("/css", express.static(__dirname + "/css"));
  app.use("/views", express.static(__dirname + "/views"));
  app.use("/games", express.static(__dirname + "/games"));
  app.use("/images", express.static(__dirname + "/images"));

  app.use(body_parser());
  app.use(cookie_parser());
  app.use(express_session({secret: "gamedu sec"}));

  app.set('views', path.join(__dirname + '/views'));
  app.set('view engine', 'jade');

  mongoose.connect('mongodb://localhost/test');
  var db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function(){
    console.log('Connected to mongodb');
  });
}

