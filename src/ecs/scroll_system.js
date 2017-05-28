var scrollSystem = function(eventManager) {
	var my = {};

	my.maxScrollPosition = 0;
	my.scrollDistance = 20;
	my.startDragY = null;

	// We want to render a maximum number of times a second
	var maxFps = 25;
	var delayBetweenFrames = Math.floor(1000/maxFps);
	var throttledRender = _.throttle(
		function() { my.stage.update() },
		delayBetweenFrames,
		{ leading: true });

	var moveUp = function(scrollDistance) {
		my.stage.regY -= scrollDistance;	

		if (my.stage.regY < 0)  {
			my.stage.regY = 0;
		}

		throttledRender();
	};

	var moveDown = function(scrollDistance) { 
		my.stage.regY += scrollDistance;	

		if (my.stage.regY > my.maxScrollPosition) {
			my.stage.regY = my.maxScrollPosition;
		}

		throttledRender();
	};

	var startDrag = function(event) {
		if (my.startDragY === null) {
	    	my.startDragY = event.stageY;
	    	return;
		}

		var scrollDistance = Math.abs(event.stageY - my.startDragY);
		var minDragDistance = 20;
		if (scrollDistance >= minDragDistance) {
		    if (event.stageY >= my.startDragY)
		    	moveUp(scrollDistance);
		    else
		    	moveDown(scrollDistance);
		
		    my.startDragY = event.stageY;
		}
	}

	var doDrag = function(event) {
	    my.startDragY = null;
	}

	var init = function(stage) {
		my.stage = stage;
		my.stage.regY = 0;
		key('up', function() { 
			moveUp(my.scrollDistance);
		});
		key('down', function() {
			moveDown(my.scrollDistance);
		});

		my.stage.addEventListener("stagemousemove", startDrag); 
	    my.stage.addEventListener("stagemouseup", doDrag);

	    $('#canvas').bind('mousewheel', function(e){
	        if(e.originalEvent.wheelDelta /120 > 0) {
	            moveUp(my.scrollDistance);
	        }
	        else{
	            moveDown(my.scrollDistance);
	        }
	    });
	};

	var updateHeightBeyondBounds = function(heightBeyondBounds) {
		if (heightBeyondBounds > 0) {
			my.maxScrollPosition = heightBeyondBounds;
			my.stage.regY = Math.min(my.stage.regY, heightBeyondBounds);
		} else {
			my.stage.regY = 0;
		}
	};


	var initialiseEvents = function() {
		eventManager.vent.on("SYSTEM:SCROLL:START", init);
		eventManager.vent.on("SYSTEM:SCROLL:HEIGHT_BEYOND_BOUNDS", updateHeightBeyondBounds);
	}
	initialiseEvents();
};