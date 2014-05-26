var express = require('express');
var body_parser = require('body-parser');


module.exports = function config(app){

  app.use("/css", express.static(__dirname + "/css"));
  app.use("/views", express.static(__dirname + "/views"));

  app.use(body_parser());
}

