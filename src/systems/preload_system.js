var preloadSystemFactory = function() {

    var my = {};

    my.assets = [];

    var handleFileLoad = function(event) {
        if (event.item.type === "image")
            my.assets[event.item.id] = event.result;
        else if (event.item.type === "javascript")
            document.body.appendChild(event.result);
    };

    var handleComplete = function() {
        console.log(my.assets);
        my.onComplete();
    };

    // Preloads the resources that are used for the game
    var load = function(onComplete) {
        my.onComplete = onComplete;
        var manifest = [
            { src: "src/images/tile.png", id: "background" },
            { src: "src/images/bindings.png", id: "bindings" },
        ];
        // This means we will use tag loading instead 
        // We need this so we get a debuggable file
        // heirarchy in the browser
        var useXhr = false; 
        // Create an loader with handlers
        var loader = new createjs.LoadQueue(false);
        loader.addEventListener("fileload", function(ev) {
            return handleFileLoad.call(my, ev);
        });
        loader.addEventListener("complete", function(ev) {
            return handleComplete.call(my, ev);
        });
        // Pass the manifest to the image loader
        loader.loadManifest(manifest);
    };
    my.load = load;
    return my;
};
