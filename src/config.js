/**
 * @module NotebookNumbers
 **/
(function () {
	var colours = {
        navy: "#003266",
		gold: "#FDD017",
	};
	var fonts = {
		yellowtail: "Yellowtail",
        londrinaSolid: "Londrina Solid",
	};

    var config = {
		backgroundColour: colours.navy,
		titleColour: colours.gold,
		numbersColour: colours.navy,
		titleFont: fonts.yellowtail,
        font: fonts.londrinaSolid,
        numColumns: 9,
        numRows: 20,
		coverMargin: 10,
        gizmoSystemEnabled: false,
        isVerticalLayout: false,
        isNativeApp: false
    };

    // Dynamic config
    var isMobile = platform.os.family === "Android";
	if (isMobile) {
		config.isVerticalLayout = isMobile;
	}
	config.isNativeApp = /notebook-numbers-android$/.test(navigator.userAgent);

    window.config = config;
})();
