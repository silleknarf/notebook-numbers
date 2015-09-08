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
		this.pageWidth = (this.fullWidth - config.coverMargin*2 - 20) / 2;
		var largeScreen = 1300;
		this.fontScalingFactor = this.fullWidth / largeScreen
	};

	/*
	var dimensions = {
		width: 700,
		numColumns: 9,
		height: 3000,
		cellHeight: 40,
		marginLeft: 15,
		marginTop: 15,
	};*/
    window.Dimensions = Dimensions;
})();
