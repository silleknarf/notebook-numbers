//
// NotebookNumbers.js -- version 1
//

if(!Array.prototype.last) {
    Array.prototype.last = function() {
        return this[this.length - 1];
    }
}



function NotebookNumbers() {} 

NotebookNumbers.prototype = new Grid();
NotebookNumbers.prototype.init = function() {
	Grid.prototype.init.call(this);
	this.selected = []
	//this.rowCount = 20;	
	this.cellHeight = 40;
	this.marginLeft = 15;
	this.marginTop = 15;
	this.stage = new createjs.Stage('notebooknumbers');	
}


NotebookNumbers.prototype.drawGrid = function(width, height) {
	var cell = {}
	cell.width = width / this.width;
	cell.height = this.cellHeight;
	for (var i = 0; i < this.grid.length; i++) {
	//for (var i = 0; i < 1; i++) {
		for (var j = 0; j < this.grid[i].length; j++) {
			var digit = this.grid[i][j];
			var image = 'img/'+digit+'.png';
			var number = new createjs.Bitmap(image);
			number.x = Math.floor(j*cell.width+this.marginLeft);
			number.y = Math.floor(i*cell.height+this.marginTop);
			number.i = i;
			number.j = j;

			// Create a hitbox for each number
			var hit = new createjs.Shape();
			hit.graphics.beginFill("#F00").drawRect(0, 0, cell.width, cell.height);
			number.hitArea = hit;

			number.onClick = function(evt) {
				console.log("You clicked:");
				console.log("evt i:"+evt.target.i,"evt j:"+evt.target.j);
				app.cursor.click(new Cell(evt.target.j,evt.target.i));
				var valid = app.check();
				console.log("Valid move:"+valid);
			}

			this.stage.addChild(number);
		}	
	}
	this.stage.update();
}

function init() {
	app = new NotebookNumbers();
	app.init();
	app.drawGrid(1024,768);
}
/*
function Controls() {

	this.stage.onMouseMove(evt) {
		if (evt.intersects(a number)) {
			// add to hand
		}
	}
}*/
