var gridViewComponent = function() {

	var createCell = function() {
		this.i = i;
		this.j = j;
		this.inCursor = false;

		// Set the cell position
		this.x = Math.floor(j*width+config.marginLeft);
		this.y = Math.floor(i*height+config.marginTop+dimensions.getTop());

		// Set up the cell background image
		//this.number = new createjs.Bitmap(NotebookNumbers.assets[digit]);
		if (digit == 0)
			digit = "";
		this.number = new createjs.Text(digit, "30px "+config.font, config.backgroundColour);
		this.number.textAlign = "center";
		this.number.x = 15;
		this.number.i = i;
		this.number.j = j;
		this.number.digit = digit;

		if (allowClick) {

			// Create a hitbox for each number
			var hit = new createjs.Shape();
			hit.graphics.beginFill("#F00").drawRect(0, 0, width, height);
			this.number.hitArea = hit;

			/** 
			 * Event that is triggered when a cell is clicked, passes a copy of the current grid item
			 * to the cursor to be evaluated.
			 *
			 * @event onClick
			 **/
		    this.number.on("click", function(evt) {
		        // Get the cell context
		        var target = evt.target;

		        // Create a dummy test cell for evaluation
		        var disableClick = false;
		        var tempCell = new Cell(target.i, target.j, width, height, target.digit, disableClick, dimensions);
		        // Pass it to the cursor for further evaluation
		        eventManager.vent.trigger(Cursor.events.check, tempCell);
		    });
			/** 
			 * Event that is triggered when a cell is being hovered over, passes a copy of the current grid item
			 * to the cursor to be evaluated.  
			 * 
			 * @event onMouseOver
			 **/
		    this.number.on("mouseover", function(evt) {
		        // Get the cell context
		        var target = evt.target;

		        // Create a dummy test cell for evaluation
		        var disableClick = false;
		        var tempCell = new Cell(target.i, target.j, width, height, target.digit, disableClick, dimensions);
		        // Pass it to the cursor for further evaluation
		        eventManager.vent.trigger(Cursor.events.add, tempCell);
		    });
			
			// Add the graphics to the easel.js canvas 
			this.addChild(this.number);
		}
	}
	
	var render = function(renderSystem, entity, eventManager) {
		var bounds = entity.components[componentTypeEnum.BOUNDS];
		var grid = entity.components[componentTypeEnum.GRID];
		renderSystem.stage.removeAllChildren();

		renderSystem.stage.addChild()

	    // Create each cell and add it to the grid
	    for (var i = 0; i < grid.length; i++) {
	        for (var j = 0; j < grid[i].length; j++) {
	            var cell = new Cell(i, j, width, height, digit);
	            for (var k = 0; k < cursor.length; k++) {
	                if (cell.equals(cursor[k])) {
	                    cell.inCursor = true;
	                }
	            }
	            this.cells.addChild(cell);
	        }
	    }
	};
	var my = viewComponent(null, render);
	return my;
};