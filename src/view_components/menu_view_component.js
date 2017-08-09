var menuViewComponent = function() {
    var my = {};
    my.menuItems = {};

    var getFont = function(absolute) {
        var menuItemsCount = _.keys(my.menuItems).length;
        var fontSize = Math.floor(absolute.height / (menuItemsCount + 1));
        var font = fontSize + "px " + config.titleFont;
        return font;
    };

    var addMenuItem = function(absolute, key, text, sortOrder, action) {
        var menuItem = new createjs.Text("- " + text + " -");

        menuItem.font = getFont(absolute);
        menuItem.color = config.titleColour;

        // Adding collision detection
        var hitMenuItem = new createjs.Shape();
        hitMenuItem.graphics
            .beginFill("#F00")
            .drawRect(0, 0, menuItem.getMeasuredWidth()*1.1, menuItem.getMeasuredHeight() * 1.5);

        menuItem.hitArea = hitMenuItem;
        menuItem.on("click", function() {
            action();
        });
        my.renderSystem.stage.addChild(menuItem);
        my.menuItems[key] = menuItem;
    }
    
    var init = function(renderSystem, entity, eventManager) {
        my.renderSystem = renderSystem;
        var view = entity.components[componentTypeEnum.BOUNDS];
        var absolute = view.absolute;

        addMenuItem(
            absolute, 
            "newGame", 
            "New Game", 
            1,
            function() { 
                eventManager.vent.trigger("SYSTEM:MODE:CLASSIC");
            });

        addMenuItem(
            absolute, 
            "tutorial", 
            "Tutorial", 
            2,
            function() { 
                eventManager.vent.trigger("SYSTEM:MODE:TUTORIAL");
            });

        addMenuItem(
            absolute, 
            "leaderboards", 
            "Leaderboards", 
            3,
            function() { 
                eventManager.vent.trigger("SYSTEM:LEADERBOARDS:ACTION");
            });

        addMenuItem(
            absolute, 
            "level", 
            "Level: ", 
            4,
            function() { 
                eventManager.vent.trigger("SYSTEM:LEVEL:NEXT");
                eventManager.vent.trigger("SYSTEM:BOUNDS:UPDATE");
            });
    };

    var render = function(renderSystem, entity, eventManager) {
        var bounds = entity.components[componentTypeEnum.BOUNDS];
        var firstMenuItem = _.head(_.values(my.menuItems));
        var menuItemsCount = _.keys(my.menuItems).length;
        var font = getFont(bounds.absolute);

        my.menuItems.level.text = "- Level: " + eventManager.vent.trigger("SYSTEM:LEVEL:GET_NEXT_NUMBER").number + " -";
        my.menuItems.level.visible = eventManager.vent.trigger("SYSTEM:MODE:GET").mode !== "tutorial";
        my.menuItems.leaderboards.text = "- " + eventManager.vent.trigger("SYSTEM:LEADERBOARDS:GET_ACTION").text + " -";

        var i = 0;
        _.forEach(
            my.menuItems,
            function(menuItem) {
                var middle = Math.floor(bounds.absolute.width/2 - menuItem.getMeasuredWidth()/2);
                menuItem.x = bounds.absolute.x + middle;
                menuItem.y = bounds.absolute.y + bounds.absolute.height * i / menuItemsCount; 
                menuItem.font = font;
                i++;
            });
    }

    var remove = function(renderSystem) {
        _.forEach(
            my.menuItems,
            function(menuItem) {
                renderSystem.stage.removeChild(menuItem);
            });
    };

    return viewComponent(init, render, remove);
};