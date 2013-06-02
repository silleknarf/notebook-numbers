(function() {
	var Cell = function(i, j, width, height, digit, allowClick) {
		this.initialize(i, j, width, height, digit, allowClick);
	}

	var p = Cell.prototype = new createjs.Container();
	p.Container_initialize = p.initialize;
	p.initialize = function(i, j, width, height, digit, allowClick) {
		//createjs.Container.apply(this);
		this.Container_initialize();
		this.digit = digit;
		this.i = i;
		this.j = j;

		this.number = new createjs.Bitmap(app.assets[digit]);

		this.x = Math.floor(j*width+app.marginLeft);
		this.y = Math.floor(i*height+app.marginTop);
		this.number.i = i;
		this.number.j = j;
		this.number.digit = digit;
		this.inCursor = false;

		if (allowClick) {

			// Create a hitbox for each number
			var hit = new createjs.Shape();

			hit.graphics.beginFill("#F00").drawRect(0, 0, width, height);
			this.number.hitArea = hit;
			this.number.onClick = function(evt) {
				var target = evt.target;
				var disableClick = false;
				var tempCell = new Cell(target.i, target.j,width,height,target.digit, disableClick);
				app.grid.cursor.onClick(tempCell);
				//app.redrawCursor();
				app.updateCells();
				var digit = target.digit;
				this.image = app.assets[digit];
				app.updateCells();
			}
			this.number.onMouseOver = function(evt) {
				var target = evt.target;
				var disableClick = false;
				var tempCell = new Cell(target.i, target.j,width,height,target.digit, disableClick);
				app.grid.cursor.onMouseOver(tempCell);
				//app.redrawCursor();
				app.updateCells();
				var digit = target.digit;
				this.image = app.assets[digit];
				app.updateCells();
			}

			this.addChild(this.number);
		}
	}

	Cell.prototype.onTick = function() {

		if (this.inCursor) {
			var g = new createjs.Graphics();
			g.setStrokeStyle(1);
			g.beginStroke(createjs.Graphics.getRGB(0,0,0));
			g.beginFill(createjs.Graphics.getRGB(255,255,255));
			g.drawCircle(0,0,2);

			var s = new createjs.Shape(g);
			s.x = 15;
			s.y = 32;

			this.addChild(s);
		}
	}

	// Add two points together
	Cell.prototype.equals = function(otherCell) {
		return (this.i == otherCell.i) && (this.j == otherCell.j);
	}

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
