var express = require('express');

module.exports = function config(app){

  app.use("/css", express.static(__dirname + "/css"));
  app.use("/views", express.static(__dirname + "/views"));


}

