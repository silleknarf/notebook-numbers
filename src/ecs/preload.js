var preloadSystemFactory = function() {

	var my = {};

	my.assets = [];

	/**
	*  Callback function from the preloader to store the images in the app.assets object
	*
	*  @method handleFileLoad
	**/
	var handleFileLoad = function(event) {
		if (event.item.type === "image")
			my.assets[event.item.id] = event.result;
		else if (event.item.type === createjs.AbstractLoader.JAVASCRIPT)
			console.log(event);
	};

	/**
	*  Callback function for when the images have all been loaded
	*
	*  @method handleComplete
	**/
	var handleComplete = function() {
		// Log the preloaded files for now
		console.log(my.assets);
		my.onComplete();
	};

	/**
	* Preloads the images that are used for the game
	*
	* @method loadImages
	**/
	var load = function(onComplete) {
		my.onComplete = onComplete;
		var manifest = [
		    { src: 'src/images/tile.png', id: 'background' },
		    { src: 'src/images/bindings.png', id: 'bindings' },
		];
		// Create an image loader with handlers
		var loader = new createjs.LoadQueue();
		loader.addEventListener("fileload", function(ev) {
		    return handleFileLoad.call(my, ev);
		});
		loader.addEventListener("complete", function(ev) {
		    return handleComplete.call(my, ev);
		});
		// Pass the manifest to the image loader
		loader.loadManifest(manifest);
	};
	my.load = load;
	return my;
};
