/**
 * @module NotebookNumbers
 **/
(function () {

	function Dimensions() {
		this.update();
		$( window ).resize(function() { 
			setTimeout(function() {
				eventManager.vent.trigger(Grid.events.render);
				eventManager.vent.trigger(BackgroundView.events.render);
			}, 50);
		});
	    this.yScrollPosition = 0;
	};

	Dimensions.prototype.update = function() {
		this.fullWidth = $("#canvas-holder").width();
		this.fullHeight = $("#canvas-holder").width();
	    this.isVerticalLayout = createjs.Touch.isSupported() || this.fullWidth < 1000;
		this.pageWidth = (this.fullWidth - config.coverMargin*2 - 20) / (this.isVerticalLayout ? 1 : 2);
		var largeScreen = 1300;
	    this.fontScalingFactor = this.fullWidth / largeScreen;
	};

    Dimensions.prototype.getTop = function() {
        return this.isVerticalLayout ? this.fullWidth * 0.45 : 0;
    }

    Dimensions.prototype.getHeight = function() {
        var height = this.getTop() + config.cellHeight * this.gridHeight + config.marginTop;
        return height;
    }

    Dimensions.prototype.getBottom = function() {
        var buttonPadding = 65;
        var bottom = this.getHeight() + buttonPadding;
        return Math.max(bottom, 820);
    }

    Dimensions.prototype.mousedown = function(evt) {
        this.lastMouseDown = evt.rawY;
    }

    Dimensions.prototype.mouseup = function(evt) {
        var scrollMovement = evt.rawY - this.lastMouseDown;
        var yScrollPosition = this.yScrollPosition + scrollMovement;
        var maxYScrollPosition = Math.max(this.fullHeight - this.getHeight() - this.getTop(), 0);
        this.yScrollPosition = yScrollPosition > maxYScrollPosition
            ? maxYScrollPosition
            : yScrollPosition;
        console.log("yScrollPosition: "+this.yScrollPosition);
    }

    window.Dimensions = Dimensions;
})();
