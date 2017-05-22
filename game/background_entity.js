var backgroundEntityFactory = function() {

	var coverBoundsComponent = boundsComponent({ x: 0, y: 0, width: 100 });
	var coverEntityComponents = [coverViewComponent(), coverBoundsComponent];
	var coverEntity = entity("cover", coverEntityComponents);

	var gridBackgroundWidth = config.isVerticalLayout ? 100 : 50;
	var gridBackgroundY = config.isVerticalLayout ? 40 : 0;
	var gridBackgroundBoundsComponent = boundsComponent({ x: 0, y: gridBackgroundY, width: gridBackgroundWidth });
	var gridBackgroundEntityComponents = [gridBackgroundViewComponent(), gridBackgroundBoundsComponent];
	var gridBackgroundEntity = entity("grid_background", gridBackgroundEntityComponents);

	var menuPageX = config.isVerticalLayout ? 0 : 50;
	var titleBoundsComponent = boundsComponent({ x: menuPageX, y: 0, width: gridBackgroundWidth, height: 20});
	var titleEntityComponents = [titleViewComponent(), titleBoundsComponent];
	var titleEntity = entity("title", titleEntityComponents);

	var menuBoundsComponent = boundsComponent({ x: menuPageX, y: 20, width: gridBackgroundWidth, height: 20});
	var menuEntityComponents = [menuViewComponent(), menuBoundsComponent];
	var menuEntity = entity("menu", menuEntityComponents);

	var subEntities = [coverEntity, gridBackgroundEntity, titleEntity, menuEntity];

	var backgroundEntityComponents = [backgroundViewComponent(), boundsComponent()];
	var backgroundEntity = entity("background_view", backgroundEntityComponents, subEntities);

	return backgroundEntity;
}