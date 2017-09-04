"use strict";
(function() {
	const express = require("express");
	const router = express.Router();
	const bodyParser = require("body-parser");
	const hotdogModel = require('../models/hotdog.js');
	const Clarifai = require('clarifai');
	const app = new Clarifai.App({
	 apiKey: process.env.CLARIFAI_API_KEY
	});
//==================================================
	router.post('/api/hotdog', function(req,res){
		console.log('POST --> /api/hotdog');
		console.log('req.body',req.body);
		const wordBank = ['hotdog','hot dog'];
		const imageData = req.body;
		// const imageData = req.body.imageData;
		console.log('imageData',imageData);
		
		// predict the contents of an image by passing in a url
		app.models.predict(Clarifai.FOOD_MODEL, imageData).then(
			function(response) {
				console.log('response',response);
				let conc = response.outputs[0].data.concepts;
				
				for (var i=0; i<conc.length; i++) {
					let ci = conc[i];
					let certainty = ci.value;
					let name = ci.name;
					let iof = wordBank.indexOf(name);

					if (iof !== -1) {
						res.json({ isHotDog: true })
					}
				};
				
				res.json({ isHotDog: false })
			},
			function(err) {
				console.error(err);
			}
		);
	})


//==================================================
	module.exports = router; // Export routes for server.js to use.
////////////////////////////////////////////////////
})();