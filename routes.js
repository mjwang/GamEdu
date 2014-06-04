var teacher_id = 198273123123791870;

require('./schema.js');

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
		var gname = req.body.game_name;
		var gsubject = req.body.game_subject;
		var gdesc = req.body.game_desc;
		
		var next_id = 1;
		var g_id = next_id;
		next_id++;

		var new_game = Game({gid: g_id, 
				name: 'gname',
				game_type: 'default',
				published: false,
				questions: [],
				times_played: 0});
		
		new_game.save(function(err){
			if (err) {
				console.log("Error: Couldn't Save Game");
			}
		});

		res.redirect('/edit_game/' + g_id);
	})


	app.route('/edit_game/:gid')
	  .get(function(req, res, next, gid){
		//TODO: Get relevant game info
		//res.sendfile(__dirname + '/views/view_game.html');
		console.log("edit game route");
		res.send(req.body.gid);
	})
	  .post(function(req, res, next, gid){


	})


	function checkAuth(req, res, next) {
		if (!req.session.user_id) {
			res.redirect("/error");
		} else {
			next();
		}
	}

	function generate_gid(){
		'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    		var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    		return v.toString(16);
		});
	}
}
