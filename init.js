var routes = require('./routes');
var config = require('./config');


module.exports = function setup(app){

	config(app);

	routes(app);

	return app
};
