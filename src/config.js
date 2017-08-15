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
    config.isAndroid = platform.os.family === "Android";
    config.isIos = platform.os.family == "iOS";
    config.isMobile = config.isAndroid || config.isIos
    if (config.isMobile) {
        config.isVerticalLayout = config.isMobile;
        config.numRows = 6;
    }
    config.isAndroidNativeApp = /notebook-numbers-android$/.test(navigator.userAgent);
    config.isIosNativeApp = /notebook-numbers-ios$/.test(navigator.userAgent);
    config.isNativeApp = config.isAndroidNativeApp || config.isIosNativeApp;
    config.isApprovedVersion = !config.isMobile || config.isNativeApp;

    window.config = config;
})();
