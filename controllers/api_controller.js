"use strict";
(function() {
	const express = require("express");
	const router = express.Router();
	const bodyParser = require("body-parser");
	const Clarifai = require('clarifai');
	const app = new Clarifai.App({
	 apiKey: process.env.CLARIFAI_API_KEY
	});
	router.post('/api/hotdog', function(req,res){
		console.log('------------ POST /api/hotdog ----------->');
		let imageData = req.body.data;
		app.models.predict("notSely", imageData).then(
			function(response) {
				let { outputs } = response;				
				let conc = outputs[0].data.concepts;
				console.log('===> RESPONSE ====',conc);					
					const confid = conc[0].value;
					if (confid > .7) {
						res.json({ isHotDog: true });
					} else {
						res.json({ isHotDog: false });
					}
			},
			function(err) {
				console.log('===> ERROR ====', err.status, err.statusText, err);
				res.json({ error: true })
			}
		);
	})

	module.exports = router;
})();
