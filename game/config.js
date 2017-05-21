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
        // TODO: delete this
        height: 3000,
        // TODO: delete this
        cellHeight: 40,
        // TODO: delete this
        marginLeft: 15,
        // TODO: delete this
        marginTop: 15,
        gizmoSystemEnabled: false
    };
    window.config = config;
})();
