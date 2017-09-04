'use strict';
(function(){
// DEPENDENCIES =================================== 
	var express = require("express");
	var bodyParser = require("body-parser");
	var exphbs = require("express-handlebars");
	var path = require("path");
	require('dotenv').config();
// CONFIG =========================================
	var app = express();
	var port = process.env.PORT || 3000;
	
	app.disable("x-powered-by");
	
	// Set Static Directory
	app.use(express.static(path.join(__dirname, "public")));
	
	// Set Handlebars
	app.engine("handlebars", exphbs({ defaultLayout: "blank" })); 
	app.set("view engine", "handlebars");
	
	// Set Body Parser
	app.use(bodyParser.json());
	// app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.urlencoded({ 
		extended: true,
		limit: '20mb'
	}));
	app.use(bodyParser.text());
	app.use(bodyParser.json({ type: 'application/vnd.api+json'}));


	// logs each url that is requested, then passes it on.
	app.use(function(req, res, next) {
		console.log("url : " + req.url);
		next();
	});

// ROUTES =========================================
	
// var hotdogsController = require("./controllers/apps/hotdogs_controller.js");
app.use("/", require("./controllers/api_controller.js"));

var routes = require("./controllers/html_controller.js");
app.use("/", routes);

// ERRORS =========================================
  app.use(function(req, res) {
    // res.type("text/html");
    res.status(404);
    res.render("404");
  });

  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render("500");
  });


// START SERVER ===================================
  app.listen(port, function() {
     console.log(`-------------------------------------------------------
                                          ready @ ${port}`);
  });
//==================================================	
})();