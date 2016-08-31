var boundsSystem = function(ecs, eventManager) {
	var my = {};

	var update = function() {
		var fullWidth = $("#canvas").width();
		var fullHeight = window.innerHeight
			|| document.documentElement.clientHeight
			|| document.body.clientHeight;

		fullHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
		var canvasTop = $("#canvas").position().top;
		fullHeight -= canvasTop;

		fullHeight = $("#canvas").height();



		// only use 93.6% of the screen when running in browser (the amount of space 
		// remaining on the screen)

		var maxAbsoluteBounds = { 
			absolute: {
				x: 0,
				y: 0,
				width: fullWidth,
				height: fullHeight
			}
		};
		console.log("Width: " + fullWidth + ", Height: " + fullHeight);

		ecs.runSystem(
			[componentTypeEnum.BOUNDS],
			function(entity) {
				var bounds = entity.components[componentTypeEnum.BOUNDS];
				var parentBounds = entity.parent 
					? entity.parent.components[componentTypeEnum.BOUNDS]
					: maxAbsoluteBounds;

				bounds.absolute.width = (bounds.relative.width / 100) * parentBounds.absolute.width;
				bounds.absolute.height = (bounds.relative.height / 100) * parentBounds.absolute.height;
				bounds.absolute.x = (bounds.relative.x / 100) * parentBounds.absolute.width + parentBounds.absolute.x;
				bounds.absolute.y = (bounds.relative.y / 100) * parentBounds.absolute.height + parentBounds.absolute.y;			
			})
	}

	var start = function() {
		$(document).ready(function() {
			update();
			$( window ).resize(function() { 
				setTimeout(update, 50);
			});
			eventManager.vent.on("SYSTEM:BOUNDS:UPDATE", update);
		});
	};

	var initialiseEvents = function() {
		eventManager.vent.on("SYSTEM:BOUNDS:START", start);
	};
	initialiseEvents();
};
