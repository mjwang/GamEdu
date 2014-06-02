var express = require('express');
var body_parser = require('body-parser');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSchema = mongoose.Schema({
  gid: Number,
  name: String,
  game_type: String,
  published: Boolean,
  questions: [{question: String, answer: String}],
  times_played: Number
});

var Game = mongoose.model('Game', gameSchema);

module.exports = function config(app){

  app.use("/css", express.static(__dirname + "/css"));
  app.use("/views", express.static(__dirname + "/views"));

  app.use(body_parser());

  mongoose.connect('mongodb://localhost:3000/mydb');
  var db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function(){
    console.log('Connected to mongodb');
  });
}

