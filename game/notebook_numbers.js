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
	this.selected = []
	//this.rowCount = 20;	
	this.cellHeight = 40;
	this.marginLeft = 15;
	this.marginTop = 15;
	this.stage = new createjs.Stage('notebooknumbers');	
	this.grid = new Grid();
}


NotebookNumbers.prototype.drawGrid = function(width, height) {
	var cell = {}
	cell.width = width / this.width;
	cell.height = this.cellHeight;
	var grid = this.grid.data;
	for (var i = 0; i < grid.length; i++) {
	//for (var i = 0; i < 1; i++) {
		for (var j = 0; j < grid[i].length; j++) {
			var digit = grid[i][j];
			var image = 'img/'+digit+'.png';
			var number = new createjs.Bitmap(image);
			number.x = Math.floor(j*cell.width+marginLeft);
			number.y = Math.floor(i*cell.height+marginTop);
			number.i = i;
			number.j = j;

			// Create a hitbox for each number
			var hit = new createjs.Shape();
			hit.graphics.beginFill("#F00").drawRect(0, 0, cell.width, cell.height);
			number.hitArea = hit;

			number.onClick = function(evt) {
				console.log("You clicked:");
				console.log("evt i:"+evt.target.i,"evt j:"+evt.target.j);
				app.grid.cursor.click(new Cell(evt.target.j,evt.target.i));
				var valid = app.check();
				console.log("Valid move:"+valid);
			}

			stage.addChild(number);
		}	
	}
	stage.update();
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
