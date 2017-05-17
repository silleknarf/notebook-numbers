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
        navy: "#003266",
		backgroundColour: colours.navy,
		titleColour: colours.gold,
		numbersColour: colours.navy,
		titleFont: fonts.yellowtail,
        font: fonts.londrinaSolid,
        numColumns: 9,
        numRows: 20,
		coverMargin: 10,
        height: 3000,
        cellHeight: 40,
        marginLeft: 15,
        marginTop: 15,
        gizmoSystemEnabled: true
    };
    window.config = config;
})();
