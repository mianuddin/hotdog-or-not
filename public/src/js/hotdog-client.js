// Hot Dogs or Not Hot Dogs App
// by Wayne Cheng
// Last Save: 9/4/17 3:54am
/////////////////////////////////
var $h = $('html');

var client = {
	imageData: '',
	useType: 'url',
	getFile: function(e){
			e.preventDefault();
			client.reboot(); // remove html result class
			console.log("getting file input");
		
			var file = document.getElementById("cameraInput").files[0];
			var reader = new FileReader();
		
			reader.addEventListener(
				"load",
				function() {
					var res = reader.result;
		
					// console.log('reader.result', res);
					$(".img-canvas").css("background-image", 'url("' + res + '")');
					// Convert to base 64 for use in query. Important!!!!!
					var b64 = res.replace(/^data:image\/(.*);base64,/, "");
					client.imageData = { base64: b64 };
		
					// Get Orientation of device
					if (userInfo.stats.orientation === "portrait") {
						$(".img-canvas").addClass("portrait");
						client.adjustBackground();
						$(".img-canvas").addClass("adjusted");
					}
		
					// Submit button pulse
					client.removeLanding();
					$("#submit").addClass("pulse");
				},
				false
			);
		
			if (file) {
				reader.readAsDataURL(file);
			}
		},
	getOrientation: function(type, img) {
			var orientation = window.screen.orientation.type;
			console.log("orientation", orientation);
			var split = orientation.split("-");
			return split[0];
		},
	getDeviceType: function() {},
	adjustBackground: function(e) {
		e.preventDefault();
			var aspect = $("body").height() / $("body").width();
			if ($(".img-canvas").hasClass("adjusted")) {
				$(".img-canvas").css("width", "100%");
				$(".img-canvas").removeClass("adjusted");
				$(".img-canvas").removeClass("portrait");
			} else {
				$(".img-canvas").css("width", aspect * 100 + "%");
				$(".img-canvas").addClass("adjusted portrait");
			}
		},
	useTypeManager: function(type) {
			// Clear previous class before
			$h.removeClass("using-camera");
			$h.removeClass("using-url");
			$h.removeClass("using-file");

			if (type === "camera") {
				$h.addClass("using-camera");
				$h.attr("data-type", "camera");
			} else if (type === "url") {
				$h.addClass("using-url");
				$h.attr("data-type", "url");
			} else if (type === "file") {
				$h.addClass("using-file");
				$h.attr("data-type", "file");
			}
		},
	isHotDog: function(){
				console.log('------IS A HOT DOG!------');
				$('#result').text('Hot Dog');
				$h.addClass('res-yes');
			},
	isNotHotDog: function(){
				console.log('not a hot dog');
				$('#result').text('Not a Hot Dog');
				$h.addClass('res-no');
			},
	reboot: function(){
			// remove html result class
			$h.removeClass("res-yes");
			$h.removeClass("res-no");
			$(".portrait").removeClass("portrait");
			$("#result").text("Hot Dog or Not Hot Dog?");
		},
	removeLanding: function(){
			$(".landing").hide();
		},
	updatePhotoFromURL: function(e){
			e.preventDefault();
			var imageData = $("#url_in").val();
			// $('#query-img').attr('src',imageData);
			$(".query.img-canvas").css("background-image", "url(" + imageData + ")");
			client.imageData = imageData;
		},
	submit: function(e){
			e.preventDefault();
			console.log("submitted");

			$(this).removeClass("pulse"); // remove pulse
		
			// loading icon
			$(".preloader-wrapper").addClass("active");
			$(".loading-icon").addClass("active");
		
			// remove html result class
			$h.removeClass("res-yes");
			$h.removeClass("res-no");
		
			// var imageData;
		
			// Get selected input type
			var itype = $h.attr("data-type");
			if (itype === "url") {
				client.imageData = $("#url_in").val().trim();
				// client.imageData = imageData;
			} 
			else if (itype === "camera") {
				console.log("camera input val");
			} 
			else {
				return; // when empty?
			}
		
			client.useType = itype;
			
			$h.addClass('on-air'); // indicate data currently being sent

			$.ajax({
				type: "POST",
				data: client.imageData,
				url: '/api/hotdog'
			}).done(function(result){
				$('.preloader-wrapper').removeClass('active');
				$('.loading-icon').removeClass('active');
				console.log('result.isHotDog',result.isHotDog);
				if (result.isHotDog) {
					client.isHotDog();
				}
				else {
					client.isNotHotDog();
				}
			})
		}
};


// Listeners //////////////////////////////////////////////////
$("#rotate").on("click", client.adjustBackground);
$("#cameraInput").on("change", client.getFile); // Get file
$("#url_in").on("change", client.updatePhotoFromURL); // Update Photo Displayed in Canvas
$("#submit").on("click", client.submit); // Get image data from HTML
///////////////////////////////////////////////////////////////
$(".selectInputType").on("click", function(e) {
	e.preventDefault();
	$(".selectInputType").removeClass("selected");
	$(this).addClass("selected");

	var type = $(this).attr("data-type");
	client.useTypeManager(type);
});

// Reset on any change
$(".imgInput").on("change", function(e) {
	e.preventDefault();
	client.reboot();
	client.removeLanding();
});

// Trigger offscreen click
$("#useCamera").on("click", function(e) {
	e.preventDefault();
	$("#cameraInput").trigger("click");
});

// Bind to Window object.
// window.clar = clar;
window.client = client;
