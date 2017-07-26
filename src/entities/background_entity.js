var backgroundEntityFactory = function() {

    var coverBoundsComponent = boundsComponent({ x: 0, y: 0, width: 100, height: 100 });
    var coverEntityComponents = [coverViewComponent(), coverBoundsComponent];
    var coverEntity = entity("cover", coverEntityComponents);

    var gridBackgroundWidth = config.isVerticalLayout ? 100 : 50;
    var gridBackgroundHeight = config.isVerticalLayout ? 55 : 100;
    var gridBackgroundY = config.isVerticalLayout ? 45 : 0;
    var gridBackgroundBoundsComponent = boundsComponent({ 
        x: 0, 
        y: gridBackgroundY, 
        width: gridBackgroundWidth, 
        height: gridBackgroundHeight 
    });
    var gridBackgroundEntityComponents = [gridBackgroundViewComponent(), gridBackgroundBoundsComponent];
    var gridBackgroundEntity = entity("grid_background", gridBackgroundEntityComponents);

    var menuPageX = config.isVerticalLayout ? 0 : 50;
    var titleBoundsComponent = boundsComponent({ x: menuPageX, y: 0, width: gridBackgroundWidth, height: 20});
    var titleEntityComponents = [titleViewComponent(), titleBoundsComponent];
    var titleEntity = entity("title", titleEntityComponents);

    var menuBoundsComponent = boundsComponent({ x: menuPageX, y: 20, width: gridBackgroundWidth, height: 20});
    var menuEntityComponents = [menuViewComponent(), menuBoundsComponent];
    var menuEntity = entity("menu", menuEntityComponents);

    var scoreBoundsComponent = boundsComponent({ x: menuPageX, y: 40, width: gridBackgroundWidth, height: 5});
    var scoreEntityComponents = [scoreViewComponent(), scoreBoundsComponent, scoreComponent()];
    var scoreEntity = entity("score", scoreEntityComponents);

    var bindingsBoundsComponent = boundsComponent({ x: menuPageX-5, y: 0, width: 5 });
    var bindingsEntityComponents = [bindingsViewComponent(), bindingsBoundsComponent];
    var bindingsEntity = entity("bindings", bindingsEntityComponents);

    var subEntities = [coverEntity, gridBackgroundEntity, titleEntity, menuEntity, scoreEntity];

    if (!config.isVerticalLayout)
        subEntities.push(bindingsEntity)

    var backgroundEntityComponents = [backgroundViewComponent(), boundsComponent()];
    var backgroundEntity = entity("background_view", backgroundEntityComponents, subEntities);

    return backgroundEntity;
}