var teacher_id = 198273123123791870;



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

	function checkAuth(req, res, next) {
		if (!req.session.user_id) {
			res.redirect("/error");
		} else {
			next();
		}
	}
}
