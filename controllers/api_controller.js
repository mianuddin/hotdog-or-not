"use strict";
(function() {
	const express = require("express");
	const router = express.Router();
	const bodyParser = require("body-parser");
	const Clarifai = require('clarifai');
	const app = new Clarifai.App({
	 apiKey: process.env.CLARIFAI_API_KEY
	});
	const wordBank = ['hotdog','hot dog'];
//==================================================
	router.post('/api/hotdog', function(req,res){
		console.log('------------ POST /api/hotdog ----------->');
		// console.log('req.body',req.body);
		let imageData = req.body.data;
		// if (req.body.url){
		// 	imageData = req.body.url;
		// }
		// else {
		// 	imageData = req.body;
		// }
		console.log('imageData',imageData);
		
		// predict the contents of an image by passing in a url
		app.models.predict(Clarifai.FOOD_MODEL, imageData).then(
			function(response) {
				let { outputs } = response;				
				let conc = outputs[0].data.concepts;
				console.log('===> RESPONSE ====',conc);					
					
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
				console.log('===> ERROR ====', err.status, err.statusText);
				res.json({ error: true })
			}
		);
	})


//==================================================
	module.exports = router; // Export routes for server.js to use.
////////////////////////////////////////////////////
})();
