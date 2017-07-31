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

            { src: "lib/easeljs-0.8.1.min.js" },
            { src: "lib/jquery-3.1.0.min.js" },
            { src: "lib/lodash.min.js" },
            { src: "lib/backbone-min.js" },
            { src: "lib/keymaster-min.js" },
            { src: "lib/platform.js" },

            { src: "src/ecs/ecs.js" },
            { src: "src/ecs/entity.js" },
            { src: "src/ecs/components.js" },

            { src: "src/event_manager.js" },

            { src: "src/config.js" },

            { src: "src/view_components/background_view_component.js" },
            { src: "src/view_components/refill_grid_view_component.js" },
            { src: "src/view_components/menu_view_component.js" },
            { src: "src/view_components/cell_view_component.js" },
            { src: "src/view_components/cursor_view_component.js" },
            { src: "src/view_components/title_view_component.js" },
            { src: "src/view_components/text_view_component.js" },
            { src: "src/view_components/cover_view_component.js" },
            { src: "src/view_components/grid_background_view_component.js" },
            { src: "src/view_components/bindings_view_component.js" },
            { src: "src/view_components/score_view_component.js" },

            { src: "src/view_systems/grid_view_system.js" },
            { src: "src/view_systems/cursor_view_system.js" },

            { src: "src/systems/cursor_system.js" },
            { src: "src/systems/logic_system.js" },
            { src: "src/systems/mode_system.js" },
            { src: "src/systems/tutorial_system.js" },
            { src: "src/systems/score_system.js" },
            { src: "src/systems/cell_util.js" },
            { src: "src/systems/grid_util.js" },
            { src: "src/systems/render_system.js" },
            { src: "src/systems/bounds_system.js" },
            { src: "src/systems/scroll_system.js" },
            { src: "src/systems/gizmo_system.js" },

            { src: "src/entities/refill_grid_entity.js" },
            { src: "src/entities/cursor_entity.js" },
            { src: "src/entities/grid_entity.js" },
            { src: "src/entities/classic_entity.js" },
            { src: "src/entities/tutorial_entity.js" },
            { src: "src/entities/background_entity.js" },
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
