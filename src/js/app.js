var $h = $('html');

var clar = {
	wordBank: ['hotdog','hot dog'],
	useType: 'url',
	imageData: '',
	appPredict: 
			function(imageData){
				$h.addClass('on-air');
				var imageData = clar.imageData;
				// predict the contents of an image by passing in a url
				app.models.predict(Clarifai.FOOD_MODEL, imageData).then(
				  function(response) {
				  	$('.preloader-wrapper').removeClass('active');
				  	$('.loading-icon').removeClass('active');
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
};
function reboot(){
	// remove html result class
	$h.removeClass('res-yes');
	$h.removeClass('res-no');
	$('#result').text('Hot Dog or Not Hot Dog?');
};

function removeLanding(){
	$('.landing').hide();
}



// Get file
$('#cameraInput').on('change', getFile);
function getFile() {
    // remove html result class
    reboot();
    console.log('get file input');

    var file = document.getElementById('cameraInput').files[0];
    var reader = new FileReader();

    reader.addEventListener("load", function() {
        var res = reader.result;
        // console.log('reader.result', res);
        $('.img-canvas').css('background-image', 'url("' + res + '")');
        // Convert to base 64 for use in query. Important!!!!!
        var b64 = res.replace(/^data:image\/(.*);base64,/, '');
        clar.imageData = { base64: b64 };

        // Submit button pulse
        removeLanding();
        $('#submit').addClass('pulse');
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
}

// Get image URL from HTML
	$('#submit').on('click',function(e){
		e.preventDefault();
		console.log('submitted');
		// remove pulse
		$(this).removeClass('pulse');

		// loading icon
		$('.preloader-wrapper').addClass('active');
	  	$('.loading-icon').addClass('active');

		// remove html result class
		$h.removeClass('res-yes');
		$h.removeClass('res-no');

		var imageData;

		// Get selected input type
		var itype = $h.attr('data-type');
		if (itype === 'url'){
			imageData = $('#url_in').val().trim();
			clar.imageData = imageData;
		}
		else if (itype === 'camera'){
			console.log('camera input val');
		}
		else {
			// when empty?
			return;
		}

		clar.useType = itype;
		// console.log('clar.useType',clar.useType);
		// console.log('clar.imageData',clar.imageData);
		clar.appPredict();
	});


// Listeners //////////////////////////////////////////////////
$('.selectInputType').on('click',function(e){
	e.preventDefault();
	$('.selectInputType').removeClass('selected');
	$(this).addClass('selected');

	var type = $(this).attr('data-type');
	clar.useTypeManager(type);
});


// Update photo on URL change
$('#url_in').on('change',function(e){
	e.preventDefault();
	var imageData = $('#url_in').val();
	// $('#query-img').attr('src',imageData);
	$('.query.img-canvas').css('background-image','url('+ imageData +')');
	clar.imageData = imageData;
});


// Reset on any change
$('.imgInput').on('change',function(e){
	e.preventDefault();
	reboot();
	removeLanding();
});


// Trigger offscreen click
	$('#useCamera').on('click',function(e){
		e.preventDefault();
		$('#cameraInput').trigger('click');
	});
