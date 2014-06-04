var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Game = new Schema({
  name: String,
  subject: String,
  desc: String,
  game_type: String,
  published: Boolean,
  questions: [{question: String, answer: String}],
  times_played: Number
});

module.exports = mongoose.model('Game', Game);
	
