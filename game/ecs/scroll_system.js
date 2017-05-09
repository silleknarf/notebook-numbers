var scrollSystem = function(eventManager) {
	var my = {};

	my.maxScrollPosition = 0;
	my.scrollDistance = 20;

	var moveUp = function() {
		my.stage.regY -= my.scrollDistance;	

		if (my.stage.regY < 0)  {
			my.stage.regY = 0;
		}
	};

	var moveDown = function() { 
		my.stage.regY += my.scrollDistance;	

		if (my.stage.regY > my.maxScrollPosition) {
			my.stage.regY = my.maxScrollPosition;
		}
	};

	var init = function(stage) {
		my.stage = stage;
		my.stage.regY = 0;
		key('up', moveUp);
		key('down', moveDown);
	};

	$(document).ready(function(){
	    $('#canvas').bind('mousewheel', function(e){
	        if(e.originalEvent.wheelDelta /120 > 0) {
	            moveUp();
	        }
	        else{
	            moveDown();
	        }
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