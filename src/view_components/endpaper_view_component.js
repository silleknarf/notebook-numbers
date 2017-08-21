var endpaperViewComponent = function() {
    var my = {};

    var updateCover = function(cover, bounds, margin) {
        var coverMargin = 30/2;
        var width = bounds.absolute.width-2*margin;
        my.coverGraphics = new createjs.Graphics();
        my.coverGraphics
            .beginFill(config.backgroundColour)
            .drawRect(
                bounds.absolute.x+margin, 
                bounds.absolute.y+coverMargin, 
                width,
                bounds.absolute.height-coverMargin
            );

        my.endpaper.graphics = my.coverGraphics;
    }

    var init = function(renderSystem, entity) {
        var bounds = entity.components[componentTypeEnum.BOUNDS];

        my.endpaper = new createjs.Shape();
        renderSystem.stage.addChild(my.endpaper);
    };

    var render = function(renderSystem, entity, eventManager) {
        var bounds = entity.components[componentTypeEnum.BOUNDS];
        
        var gridBackgroundMargin = Math.floor(bounds.absolute.width / 100);
        updateCover(my.endpaper, bounds, gridBackgroundMargin);
    }

    return viewComponent(init, render);
};