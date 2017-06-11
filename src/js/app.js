// initiate app
var app = new Clarifai.App(
'cH840lgNLjvurqRG4raEvrBBb046a6o6MheCt0aL',
'y45yaCVmc4xV8jhp2LjeqqXHgPLmcMUlYk2xkqDa'
);

var $h = $('html');

var clar = {
	wordBank: ['hotdog','hot dog'],
	useType: 'url',
	imageData: '',
	appPredict: 
			function(imageData){
				// predict the contents of an image by passing in a url
				app.models.predict(Clarifai.FOOD_MODEL, imageData).then(
				  function(response) {
				    console.log(response);
				    clar.parseResponse(response);
				  },
				  function(err) {
				    console.error(err);
				  }
				);
			},
	parseResponse: 
			function(response){
				var r = response;
				console.log('r',r);
				var conc = response.outputs[0].data.concepts;
				
				for (var i=0; i<conc.length; i++) {
					var ci = conc[i];
					var certainty = ci.value;
					
					var name = ci.name;
					var iof = clar.wordBank.indexOf(name);

					if (iof !== -1) {
						console.log('name',name);
						clar.isHotDog();
						return;
					}
				};

				clar.isNotHotDog();
			},
	isHotDog: 
			function(){
				console.log('------IS A HOT DOG!------');
				$('#result').text('Hot Dog');
				$h.addClass('res-yes');
			},
	isNotHotDog: 
			function(){
				console.log('not a hot dog');
				$('#result').text('Not a Hot Dog');
				$h.addClass('res-no');
			},

	useTypeManager:
			function(type){
				// Clear previous class before 
				$h.removeClass('using-camera');
				$h.removeClass('using-url');
				$h.removeClass('using-file');

				if (type === 'camera') {
					$h.addClass('using-camera');
					$h.attr('data-type','camera');
				}
				else if (type === 'url') {
					$h.addClass('using-url');
					$h.attr('data-type','url');
				}
				else if (type === 'file') {
					$h.addClass('using-file')
					$h.attr('data-type','file');
				}
			}
}
function getLocalFile(){

}
function reboot(){
	// remove html result class
	$h.removeClass('res-yes');
	$h.removeClass('res-no');
	$('#result').text('Hot Dog or Not Hot Dog?');
}
// Get image URL from HTML
$('#submit').on('click',function(e){
	e.preventDefault();
	console.log('submitted');

	// remove html result class
	$h.removeClass('res-yes');
	$h.removeClass('res-no');
	var imageData;

	// Get selected input type
	var itype = $h.attr('data-type');
	if (itype === 'url'){
		imageData = $('#url_in').val().trim();
	}
	else if (itype === 'file'){
		imageData = $('file_in').val();
		imageData = files[0];
	}
	else if (itype === 'camera'){
		console.log('camera input val')
	}
	else {
		// when empty?
		return;
	}

	clar.useType = itype;
	clar.imageData = imageData;
	console.log('clar.useType',clar.useType);
	console.log('clar.imageData',clar.imageData);
	clar.appPredict(imageData);
});

$('#useCamera').on('click',function(e){
	e.preventDefault();
	$('#cameraInput').trigger('click');
})


// add some inputs
// automatically tagged with general model?
	// function appSearch(imageData){
	// 	app.inputs.create(imageData).then(
	// 	  searchForDog,
	// 	  function(err) {
	// 	    console.error(err);
	// 	  }
	// 	);
	// 	// search for concepts
	// 	function searchForDog(response) {
	// 	  app.inputs.search({
	// 	    concept: {
	// 	      name: 'hotdog'
	// 	    }
	// 	  }).then(
	// 	    function(response) {
	// 	      console.log(response);
	// 	    },
	// 	    function(response) {
	// 	      console.error(response);
	// 	    }
	// 	  );
	// 	}
	// }


// $('#cameraInput').on('change', function(e) {
//     $data = e.originalEvent.target.files[0];
//     $reader = new FileReader();
//     reader.onload = function(evt) {
//         $('#your_img_id').attr('src', evt.target.result);
//         reader.readAsDaraUrl($data);
//     }
// });



// Listeners //////////////////////////////////////////////////
$('.selectInputType').on('click',function(e){
	e.preventDefault();
	$('.selectInputType').removeClass('selected');
	$(this).addClass('selected');

	var type = $(this).attr('data-type');
	clar.useTypeManager(type);
});


// Update photo on change
$('#url_in').on('change',function(e){
	e.preventDefault();
	var imageData = $('#url_in').val();
	// $('#query-img').attr('src',imageData);
	$('.query.img-canvas').css('background-image','url('+ imageData +')');
	clar.imageData = imageData;
})


// Reset on any change
$('.imgInput').on('change',function(e){
	e.preventDefault();
	reboot();
})
