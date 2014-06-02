

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
	
	app.route('/login')
	  .get(function(req, res, next){
		res.sendfile(__dirname + '/views/login.html');
	})
	  .post(function(req, res, next){
		var pw = req.body.password;
		if (pw === "malambo"){
			res.sendfile(__dirname + '/views/teacher_home.html');
		} else {
			console.log("error wrong password");
		}
	})
	
}
