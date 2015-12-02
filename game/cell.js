/**
 * @module NotebookNumbers
 **/
(function() {

	/**
	 * Sets up the cell position, properties and graphics. </br>
	 * Holds the cell information such as graphical and logical positionings in the grid. </br>
	 * It also controls the events that happen when cells are clicked. </br>
	 * Constructor for a cell on the grid.
	 * 
	 * @param {Number} i the vertical logical position of a cell
	 * @param {Number} j the horizontal logical position of a cell
	 * @param {Number} width the width of a cell on the current grid
	 * @param {Number} height the height of a cell on the current grid
	 * @param {Boolean} allowClick if true, then the cell is interactive and can be clicked
	 * @class Cell
	 * @contructor
	 **/
	var Cell = function(i, j, width, height, digit, allowClick, dimensions) {
		this.initialize(i, j, width, height, digit, allowClick, dimensions);
	}
	var p = Cell.prototype = new createjs.Container();
	p.Container_initialize = p.initialize;
	p.initialize = function(i, j, width, height, digit, allowClick, dimensions) {
		this.Container_initialize();
	    this.on("tick", this.tick, this);

		// Set up the cell properties
		this.digit = digit;
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

	/** 
	 * Called when the update function is called on the cell, e.g. every frame.
	 * At the minute it is responsible for drawing the cursor
	 *
	 * @event onTick
	 */
	Cell.prototype.tick = function() {

		// If we are in the cursor we need to draw a circle below
		if (this.inCursor) {

			// Draw a black circle below the items currently in the cursor
			var g = new createjs.Graphics();
			g.beginFill(null);
			g.setStrokeStyle(1);
			var navy = createjs.Graphics.getRGB(0,50,102);
			g.beginStroke(navy);
			g.beginFill(null);
			g.drawCircle(0,0,18);
			var s = new createjs.Shape(g);
			s.x = 16;
			s.y = 16;
			this.addChild(s);
		}
	}

	/** 
	 *  Check if two cells are logically equal
	 *
	 *  @method equals
	 *  @param {Cell} otherCell the cell you wish to compare with
	 *  @return {Boolean}
	 **/
	Cell.prototype.equals = function(otherCell) {
		return (this.i == otherCell.i) && (this.j == otherCell.j);
	}

	/** 
	 *  Check if the cell being checked is before the other cell
	 *
	 *  @method isBefore
	 *  @param {Cell} otherCell the cell you wish to compare with
	 *  @return {Boolean}
	 **/
	Cell.prototype.isBefore = function(otherCell) {
		// Case they're on the same line or otherCell is below
		if (this.i <= otherCell.i) {
			// It's definitely below
			if (this.i < otherCell.i) {
				return true;
			}

			// this is on the left on the same line
			if (this.j < otherCell.j) {
				return true;
			} 	
		}
		return false;
	}

	window.Cell = Cell;
})();
