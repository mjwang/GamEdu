var express = require('express');
var init = require('./init');
var app = express();

module.exports = init(app);

var server = app.listen(80, function() {
    console.log('Listening on port %d', server.address().port);
});
