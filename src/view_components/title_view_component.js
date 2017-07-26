var titleViewComponent = function() {
    var my = {};

    var getFont = function(absolute) {
        var fontSize = Math.floor(absolute.height / 3);
        var font = fontSize + "px " + config.titleFont;
        return font;
    };

    var init = function(renderSystem, entity, eventManager) {
        var view = entity.components[componentTypeEnum.BOUNDS];
        var absolute = view.absolute;

        var title = new createjs.Text("Notebook Numbers");
        title.font = getFont(absolute);
        title.color = config.titleColour;
        renderSystem.stage.addChild(title);
        my.title = title;
    };

    var render = function(renderSystem, entity) {
        var bounds = entity.components[componentTypeEnum.BOUNDS];
        var middleX = Math.floor(bounds.absolute.width/2 - my.title.getMeasuredWidth()/2);
        var middleY = Math.floor(bounds.absolute.height/2 - my.title.getMeasuredHeight()/2);
        my.title.x = bounds.absolute.x + middleX;
        my.title.y = bounds.absolute.y + middleY; 
        var font = getFont(bounds.absolute);
        my.title.font = font;
    };

    var remove = function(renderSystem) {
        renderSystem.stage.removeChild(my.title);
    };

    return viewComponent(init, render, remove);
};