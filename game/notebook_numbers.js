//
// NotebookNumbers.js -- version 1
//

if(!Array.prototype.last) {
    Array.prototype.last = function() {
        return this[this.length - 1];
    }
}



function NotebookNumbers() {
	this.init();
} 

NotebookNumbers.prototype = new Grid();
NotebookNumbers.prototype.init = function() {
	this.selected = []
	//this.rowCount = 20;	
	this.cellHeight = 40;
	this.marginLeft = 15;
	this.marginTop = 15;
	this.stage = new createjs.Stage('notebooknumbers');	
	createjs.Ticker.addListener(this.stage);
	this.loadImages();
	this.grid = new Grid();
	this.assets = {};
	this.numbers = new createjs.Container();
}

NotebookNumbers.prototype.loadImages = function() {
	manifest = [{src:'img/scribble.png', id: 'scribble'}]; 
	for (var i = 1; i <= 9; i++) {
		var digit = i;
		var image = 'img/'+digit+'.png';
		manifest.push({src: image, id: digit});
	}
	loader = new createjs.LoadQueue();
	loader.addEventListener("fileload", this.handleFileLoad);
	loader.addEventListener("complete", this.handleComplete);
	loader.loadManifest(manifest);
	this.stage.autoClear = false;
}

NotebookNumbers.prototype.handleFileLoad = function(event) {
 	app.assets[event.item.id] = event.result;
}

NotebookNumbers.prototype.handleComplete = function() {
	for (var i = 0; i < app.assets.length; i++) {
		// Log the preloaded files for now
		var item = app.assets[i]; //loader.getResult(id);
		console.log(item);
		//if (item.type == createjs.LoadQueue.IMAGE) {
			//var bmp = new createjs.Bitmap(result);
		//}
	}
	app.drawGrid(1024,768);
	app.drawRefillGridButton();
}



NotebookNumbers.prototype.drawGrid = function(width, height) {
	var grid = this.grid.data;
	for (var i = 0; i < grid.length; i++) {
		for (var j = 0; j < grid[i].length; j++) {
			var cell = {}
			cell.width = width / this.width;
			cell.height = this.cellHeight;
			var digit = grid[i][j];
			var number = new createjs.Bitmap(this.assets[digit]);
			number.x = Math.floor(j*cell.width+this.marginLeft);
			number.y = Math.floor(i*cell.height+this.marginTop);
			number.i = i;
			number.j = j;
			number.digit = digit;

			// Create a hitbox for each number
			var hit = new createjs.Shape();
			hit.graphics.beginFill("#F00").drawRect(0, 0, cell.width, cell.height);
			//hit.graphics.beginFill("#F"+i+j).drawRect(0, 0, cell.width, cell.height);
			number.hitArea = hit;
				
			number.onClick = function(evt) {
				console.log("You clicked:");
				console.log("evt i:"+evt.target.i,"evt j:"+evt.target.j);
				app.grid.cursor.click(new Cell(evt.target));
				app.redrawGrid();
				app.stage.update();
			}
			number.onTick = function(evt) { 
				var digit = app.grid.data[this.i][this.j];
				if (digit == 0) {
					digit = "scribble";
				}
				this.image = app.assets[digit];
			}
			console.log(number);
			this.numbers.addChild(number);
			this.stage.addChild(number);
		}	
	}
	this.stage.update();
}

NotebookNumbers.prototype.redrawGrid = function() {
	var cells = app.grid.cursor.cells;
	for (var i = 0; i < cells.length; i++) {
		var x = cells[i].x;
		var y = cells[i].y;
		var digit = app.grid.data[y][x];
		if (digit == 0) {
			digit = "scribble";
		}
		cells[i].target.image = app.assets[digit];
	}
}

NotebookNumbers.prototype.redrawRefillGrid = function() {
	this.stage.removeAllChildren();
	this.drawGrid(1024,768);
}

NotebookNumbers.prototype.drawRefillGridButton = function() {
 	var refillGrid = new createjs.Text("Refill Grid", "20px Arial", "#000000");
	refillGrid.x = Math.floor(this.marginLeft);

	var hit = new createjs.Shape();
	hit.graphics.beginFill("#F00").drawRect(0, 0, refillGrid.getMeasuredWidth(), refillGrid.getMeasuredHeight());
	//hit.graphics.beginFill("#F"+i+j).drawRect(0, 0, cell.width, cell.height);
	refillGrid.hitArea = hit;

	var topPadding = 15;
	var gridBottom = this.cellHeight * this.grid.data.length;
	refillGrid.onClick = function(evt) {
		app.grid.refillGrid();
		this.y = Math.floor(topPadding+gridBottom+app.marginTop);
		app.redrawRefillGrid();
		app.stage.update();
	}
	this.stage.addChild(refillGrid);
	this.refillGridButton = refillGrid;
}


function init() {
	app = new NotebookNumbers();
}
/*
function Controls() {

	this.stage.onMouseMove(evt) {
		if (evt.intersects(a number)) {
			// add to hand
		}
	}
}*/
