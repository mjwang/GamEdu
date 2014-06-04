var teacher_id = 198273123123791870;
require('./schema.js');
var Game = require('mongoose').model('Game');

module.exports = function routes(app){


	app.get('/', function(req, res) {
		res.sendfile(__dirname + '/views/index.html');
	});

	app.get('/test', function(req, res) {
		console.log('Testing GamEdu');
	});

	app.get('/student_home', function(req, res){
		res.sendfile(__dirname + '/views/student_home.html');
	});

	app.get('/teacher_home', checkAuth, function(req, res){
		res.sendfile(__dirname + '/views/teacher_home.html');
	}); 
	
	app.route('/login')
	  .get(function(req, res, next){
		res.sendfile(__dirname + '/views/login.html');
	})
	  .post(function(req, res, next){
		var pw = req.body.password;
		if (pw === "malambo"){
			req.session.user_id = teacher_id; 
			res.redirect('/teacher_home');
		} else {
			console.log("error wrong password");
		}
	})

	app.get('/logout', function(req, res){
		delete req.session.user_id;
		res.redirect('/');
	});

	app.get('/error', function(req, res){
		res.sendfile(__dirname + '/views/error.html');
	});

	app.route('/create_game')
	  .get(checkAuth, function(req, res, next){
		res.sendfile(__dirname + '/views/create_game.html');
	})
	  .post(function(req, res, next){
		console.log("posting newly created game");
		var gname = req.body.name;
		console.log(gname);
		var gsubject = req.body.subject;
		console.log(gsubject);
		var gdesc = req.body.desc;
		console.log(gdesc);
		
		var new_game = new Game({name: gname,
				subject: gsubject,
				desc: gdesc,
				game_type: 'default',
				published: false,
				questions: [],
				times_played: 0});
		
		new_game.save(function(err, saved_game){
			if (err) {
				console.log("Error: Couldn't Save Game");
				res.redirect('/error');
			} else {
				res.redirect('/view_game/' + saved_game.id);
			}
		});

	})

	app.param('gid', function(req, res, next, gid){
		console.log('finding game');
		Game.findOne({'_id':gid}, function(err, game){
			req.gname = game.name; 
			req.gsub = game.subject;
			req.gdesc = game.desc;
			req.published = game.published;
			req.questions = game.questions;
			req.played = game.times_played;
			next();
		});
	});

	app.get('/view_game/:gid', checkAuth, function(req, res){
		console.log("viewing game");
		console.log(req.gname);
		res.render('view_game', {gname: req.gname});
	});

	app.post('/edit_game/:gid', function(req, res){


	});

	function checkAuth(req, res, next) {
		if (!req.session.user_id) {
			res.redirect("/error");
		} else {
			next();
		}
	}

}
