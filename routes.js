var teacher_id = 198273123123791870;
require('./schema.js');
var Game = require('mongoose').model('Game');

module.exports = function routes(app){


	app.get('/', checkAuth, function(req, res) {
		//res.sendfile(__dirname + '/views/index.html');
		res.render('index', { teacher: req.teacher });
		//res.redirect('/dashboard');
	});

	app.get('/test', function(req, res) {
		console.log('Testing GamEdu');
	});

	app.get('/about', checkAuth, function(req, res){
		res.render('about', {teacher: req.teacher});
	});

	app.get('/dashboard', checkAuth, loadGames, function(req, res){
		res.render('dashboard', { games: req.games, teacher: req.teacher});	
		//res.sendfile(__dirname + '/views/teacher_home.html');
	}); 
	
	app.route('/login')
	  .get(checkAuth, function(req, res, next){
		res.render('login', {teacher: req.teacher});
		//res.sendfile(__dirname + '/views/login.html');
	})
	  .post(function(req, res, next){
		var pw = req.body.password;
		if (pw === "malambo"){
			req.session.user_id = teacher_id; 
			res.redirect('/dashboard');
		} else {
			console.log("error wrong password");
		}
	})

	app.get('/logout', function(req, res){
		delete req.session.user_id;
		res.redirect('/');
	});

	app.get('/error', function(req, res){
		res.render('error', { error_message: "The page you are accessing is either invalid or you do not have permission to access it." });
		//res.sendfile(__dirname + '/views/error.html');
	});

	app.route('/create_game')
	  .get(checkAuth, function(req, res, next){
		//res.sendfile(__dirname + '/views/create_game.html');
		if (!req.teacher) {
		  res.redirect('/error');
		}
		res.render('create_game', {teacher: req.teacher});
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

	app.get('/get_questions', function(req, res){
		Game.findOne({'_id':req.query.gid}, function(err, game){
			if (err) {
				console.log(err);
			} else {
				console.log("Questions Retrieved: ", game.questions);
				res.json({questions: game.questions});
			}
		});
	});

	app.param('gid', function(req, res, next, gid){
		console.log('finding game: ', gid);
		Game.findOne({'_id':gid}, function(err, game){
			if (!err){
				req.gname = game.name; 
				req.gsub = game.subject;
				req.gdesc = game.desc;
				req.published = game.published;
				req.questions = game.questions;
				req.played = game.times_played;
				req.gid = game.id;
				next();
			}
		});
	});

	app.get('/view_game/:gid', checkAuth, function(req, res){
		console.log("viewing game");
		console.log(req.gname);
		res.render('view_game', {gname: req.gname,
					gsubject: req.gsub,
					gdesc: req.gdesc,
					gid: req.gid,
					questions: req.questions,
					teacher: true});
	});

	app.route('/edit_game/:gid')
	  .get(checkAuth, function(req, res){
                if(!req.teacher){
			res.redirect('/error');
		} else {
			console.log("Rendering edit game page");
			res.render('edit_game', {gname: req.gname,
					gsubject: req.gsub,
					gdesc: req.gdesc,
					gid: req.gid,
					gpub: req.published,
					teacher: req.teacher});
		}
	})
	  .post(checkAuth, function(req, res){
		if(!req.teacher){
			res.redirect('/error');
		}

		var new_name = req.body.name;
		var new_subject = req.body.subject;
		var new_desc = req.body.desc;
		var new_pub;

		if (req.body.published === "on"){
			new_pub = true;	
		} else {
			new_pub = false;
		}

		Game.update({_id: req.gid}, {name: new_name, subject: new_subject, desc: new_desc, published: new_pub}, function(err, game) {
			if (err){
				console.log(err);
			} else {
				res.redirect('/view_game/' + req.gid);
			}
		});
	})

	app.route("/add_question/:gid")
          .get(checkAuth, function(req, res) {
		if (!req.teacher) {
			res.redirect('/error');
		}
		res.render('add_question', { teacher: req.teacher, gid: req.gid });
	})
	  .post(checkAuth, function(req, res){
		if (!req.teacher) {
			res.redirect('/error');
		}
		var qtn = req.body.question;
		var ans = req.body.answer;
		
		console.log('adding question: ', qtn); 

		Game.findByIdAndUpdate(req.gid, {$push: {"questions": {question: qtn, answer: ans}}}, function(err, game) {
			if (err){
				console.log(err);
			} else {
				res.redirect('/view_game/' + req.gid); 
			}
		});

	})

	app.route("/play_game/:gid")
	  .get(checkAuth, function(req, res){
		res.render('play_game', {teacher: req.teacher, gtitle: req.gname, play_game: true})
	})

	function loadGames(req, res, next){
		console.log("Fetching all games");
		Game.find(function(err, all_games){
			req.games = all_games;
			next();
		});
	}

	function checkAuth(req, res, next) {
		if (!req.session.user_id) {
			req.teacher = false;
			//res.redirect("/error");
			next();
		} else {
			req.teacher = true;
			next();
		}
	}


}
