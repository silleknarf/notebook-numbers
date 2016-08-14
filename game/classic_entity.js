var classicEntity = function() {
	var classicBounds = boundsComponent();
	classicBounds.relative.width = 50;
	var gridEntity = gridEntityFactory();
	var refillGridEntity = refillGridEntityFactory();
	return entity("classic", [classicBounds], [gridEntity, refillGridEntity]);
};