(function() {
	var preload = function() {

		self = this;

		self.assets = [];

		return {
			/**
			* Preloads the images that are used for the game
			*
			* @method loadImages
			**/
			loadImages: function(onComplete) {
				self.onComplete = onComplete;
				var manifest = [
				    { src: 'game/img/scribble.png', id: 'scribble' },
				    { src: 'game/img/tile.png', id: 'background' },
				    { src: 'game/img/bindings.png', id: 'bindings' },
				];
				for (var i = 1; i <= 9; i++) {
				    var digit = i;
				    var image = 'game/img/' + digit + '.png';
				    manifest.push({ src: image, id: digit });
				}
				// Create an image loader with handlers
				var loader = new createjs.LoadQueue();
				var that = self;
				loader.addEventListener("fileload", function(ev) {
				    return that.handleFileLoad.call(that, ev);
				});
				loader.addEventListener("complete", function(ev) {
				    return that.handleComplete.call(that, ev);
				});
				// Pass the manifest to the image loader
				loader.loadManifest(manifest);
			},

			/**
			*  Callback function from the preloader to store the images in the app.assets object
			*
			*  @method handleFileLoad
			**/
			handleFileLoad: function(event) {
				self.assets[event.item.id] = event.result;
			},

			/**
			*  Callback function for when the images have all been loaded
			*
			*  @method handleComplete
			**/
			handleComplete: function() {
				// Log the preloaded files for now
				for (var i = 0; i < preload.assets.length; i++) 
				{
				    var item = preload.assets[i]; 
				    console.log(item);
				}
				self.onComplete();
			}
		};
	}
	window.preload = preload;
})();
