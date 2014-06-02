var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Game = new Schema({
  gid: Number,
  name: String,
  game_type: String,
  published: Boolean,
  questions: [{question: String, answer: String}],
  times_played: Number
});

mongoose.Model('Game', Game);
	
