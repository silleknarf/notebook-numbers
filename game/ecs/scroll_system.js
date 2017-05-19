var scrollSystem = function(eventManager) {
	var my = {};

	my.maxScrollPosition = 0;
	my.scrollDistance = 20;
	my.startDragY = null;

	var moveUp = function(scrollDistance) {
		my.stage.regY -= scrollDistance;	

		if (my.stage.regY < 0)  {
			my.stage.regY = 0;
		}
	};

	var moveDown = function(scrollDistance) { 
		my.stage.regY += scrollDistance;	

		if (my.stage.regY > my.maxScrollPosition) {
			my.stage.regY = my.maxScrollPosition;
		}
	};

	var startDrag = function(event) {
		if (my.startDragY === null)
	    	my.startDragY = event.stageY;
	}

	var doDrag = function(event) {
		var scrollDistance = Math.abs(event.stageY - my.startDragY);
	    if (event.stageY >= my.startDragY)
	    	moveUp(scrollDistance);
	    else
	    	moveDown(scrollDistance);
	    my.startDragY = null;
	  	eventManager.vent.trigger("SYSTEM:RENDER:RENDER");
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

		my.stage.addEventListener("pressmove", startDrag); 
	    my.stage.addEventListener("pressup", doDrag);
	};

	$(document).ready(function(){
	    $('#canvas').bind('mousewheel', function(e){
	        if(e.originalEvent.wheelDelta /120 > 0) {
	            moveUp();
	        }
	        else{
	            moveDown();
	        }
	        eventManager.vent.trigger("SYSTEM:RENDER:RENDER");
	    });
	});

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