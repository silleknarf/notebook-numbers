/**
 * @module NotebookNumbers
 **/
(function () {

	function Dimensions() {
		this.update();
		$( window ).resize(function() { 
			setTimeout(function() {
				eventManager.vent.trigger("GRID:RENDER");
				eventManager.vent.trigger("BACKGROUND:RENDER");
			}, 50);
		});
	};

	Dimensions.prototype.update = function() {
		this.fullWidth = $("#canvas-holder").width();
	    this.isVerticalLayout = createjs.Touch.isSupported() || this.fullWidth < 1000;
		this.pageWidth = (this.fullWidth - config.coverMargin*2 - 20) / (this.isVerticalLayout ? 1 : 2);
		var largeScreen = 1300;
	    this.fontScalingFactor = this.fullWidth / largeScreen;
	};

    Dimensions.prototype.getTop = function() {
        return this.isVerticalLayout ? 400 : 0;
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

    window.Dimensions = Dimensions;
})();
