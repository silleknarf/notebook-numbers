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
		else if (event.item.type === "javascript")
			document.body.appendChild(event.result);
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
		    { src: "src/images/tile.png", id: "background" },
		    { src: "src/images/bindings.png", id: "bindings" },

			{ src: "lib/easeljs-0.8.1.min.js" },
			{ src: "lib/jquery-3.1.0.min.js" },
			{ src: "lib/lodash.min.js" },
			{ src: "lib/backbone-min.js" },
			{ src: "lib/keymaster-min.js" },
			{ src: "lib/platform.js" },

			{ src: "src/ecs/ecs.js" },
			{ src: "src/ecs/entity.js" },
			{ src: "src/ecs/components.js" },
			{ src: "src/ecs/event_manager.js" },
			{ src: "src/ecs/render_system.js" },
			{ src: "src/ecs/bounds_system.js" },
			{ src: "src/ecs/scroll_system.js" },
			{ src: "src/ecs/gizmo_system.js" },

			{ src: "src/config.js" },

			{ src: "src/view_components/background_view_component.js" },
			{ src: "src/view_components/refill_grid_view_component.js" },
			{ src: "src/view_components/menu_view_component.js" },
			{ src: "src/view_components/cell_view_component.js" },
			{ src: "src/view_components/cursor_view_component.js" },
			{ src: "src/view_components/title_view_component.js" },
			{ src: "src/view_components/text_view_component.js" },
			{ src: "src/view_components/cover_view_component.js" },
			{ src: "src/view_components/grid_background_view_component.js" },
			{ src: "src/view_components/bindings_view_component.js" },

			{ src: "src/view_systems/grid_view_system.js" },
			{ src: "src/view_systems/cursor_view_system.js" },

			{ src: "src/systems/cursor_system.js" },
			{ src: "src/systems/logic_system.js" },
			{ src: "src/systems/mode_system.js" },
			{ src: "src/systems/tutorial_system.js" },
			{ src: "src/systems/cell_repository.js" },
			{ src: "src/systems/grid_repository.js" },

			{ src: "src/entities/refill_grid_entity.js" },
			{ src: "src/entities/cursor_entity.js" },
			{ src: "src/entities/grid_entity.js" },
			{ src: "src/entities/classic_entity.js" },
			{ src: "src/entities/tutorial_entity.js" },
			{ src: "src/entities/background_entity.js" },
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
