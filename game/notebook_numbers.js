//
// NotebookNumbers.js -- version 0.0.3
//

function NotebookNumbers() {
	this.init();
} 

NotebookNumbers.prototype = new Grid();
NotebookNumbers.prototype.init = function() {
	this.selected = []
	this.stage = new createjs.Stage('notebooknumbers');	

	// Enable touch screen support
	//createjs.Touch.enable(this.stage);
			
	// Enable fast cursor
	this.stage.enableMouseOver();


	//this.rowCount = 20;	
	this.width = 700;
	this.numColums = 9;
	this.height = 3000;
	this.cellHeight = 40;
	this.marginLeft = 15;
	this.marginTop = 15;
	this.grid = new Grid();
	this.assets = {};
	this.loadImages();
	this.cells = new createjs.Container();
	this.stage.addChild(this.cells);
}

NotebookNumbers.prototype.loadImages = function() {
	manifest = [	{src:'img/scribble.png', id: 'scribble'},
		 	{src:'img/graph_paper_large.jpg',id: 'background'},
			{src: 'img/bindings.png',id:'bindings'}]; 
	for (var i = 1; i <= 9; i++) {
		var digit = i;
		var image = 'img/'+digit+'.png';
		manifest.push({src: image, id: digit});
	}
	loader = new createjs.LoadQueue();
	loader.addEventListener("fileload", this.handleFileLoad);
	loader.addEventListener("complete", this.handleComplete);
	loader.loadManifest(manifest);
	//this.stage.autoClear = false;
}

NotebookNumbers.prototype.handleFileLoad = function(event) {
 	app.assets[event.item.id] = event.result;
}

NotebookNumbers.prototype.handleComplete = function() {
	for (var i = 0; i < app.assets.length; i++) {
		// Log the preloaded files for now
		var item = app.assets[i]; //loader.getResult(id);
		console.log(item);
	}
	app.initGame();
}

NotebookNumbers.prototype.initGame = function() {
	// Draw things
	app.drawBackground();
	app.updateCells();
	app.drawRefillGridButton();

	// Now we can start the main loop
	createjs.Ticker.setFPS(25);
	createjs.Ticker.addListener(this);
}

NotebookNumbers.prototype.tick = function() {
	this.stage.update();
}

NotebookNumbers.prototype.updateCells = function() {
	this.cells.removeAllChildren();
	var width = this.width / this.numColums;
	var height = this.cellHeight;
	var grid = this.grid.data;
	var cursor = this.grid.cursor.cells;

	for (var i = 0; i < grid.length; i++) {
		for (var j = 0; j < grid[i].length; j++) {
			var digit = grid[i][j];
			var allowClick = true;
			var cell = new Cell(i, j, width, height, digit, allowClick);
			for (var k = 0; k < cursor.length; k++) {
				if (cell.equals(cursor[k])) {
					cell.inCursor = true;
				}
			}
			this.cells.addChild(cell);
		}	
	}

}

NotebookNumbers.prototype.drawBackground = function() {
	//var g = new createjs.Graphics();

	var coverMargin = 10;
	var cover = new createjs.Shape();

	var navy = "#003266";
	var blue = "#000066";
	var minHeight = Math.max(this.height, 2600);
	cover.graphics.beginFill(navy).drawRoundRect(0, 0, this.width*2+coverMargin*2+20, minHeight, 30);
	this.stage.addChildAt(cover, 0);


	var leftPage = new createjs.Bitmap(app.assets['background']);
	leftPage.x = coverMargin;
	leftPage.y = coverMargin;
	leftPage.sourceRect = new createjs.Rectangle(0,0,this.width, minHeight);

	this.stage.addChildAt(leftPage, 1);

	var rightPage = new createjs.Bitmap(app.assets['background']);
	rightPage.x = this.width+coverMargin+20;
	rightPage.y = coverMargin; 
	rightPage.sourceRect = new createjs.Rectangle(0,0,this.width, minHeight);
	this.stage.addChildAt(rightPage, 2);

	for (var i = 0; i < 5; i++) {
		var bindings = new createjs.Bitmap(app.assets['bindings']);
		bindings.x = this.width - 20;
		bindings.y = 10+(i*225);
		bindings.scaleX = 0.6;
		bindings.scaleY = 0.6;
		//bindings.sourceRect = new createjs.Rectangle(0,0,20,30);
		this.stage.addChildAt(bindings, 3);
	}
}

NotebookNumbers.prototype.drawRefillGridButton = function() {
	this.refillGridButton = new createjs.Container();
 	var refillGrid = new createjs.Text("Refill Grid", "32px Helvetica", "#000000");
	var middleX = this.width/2;
	var refillGridPadding = 100;
	refillGrid.x = middleX - refillGridPadding;

	var topPadding = 15;
	refillGrid.gridBottom = this.cellHeight * this.grid.data.length;
	refillGrid.y = topPadding+refillGrid.gridBottom+app.marginTop;
 
	var hit = new createjs.Shape();
	hit.graphics.beginFill("#F00").drawRect(0, 0, refillGrid.getMeasuredWidth(), refillGrid.getMeasuredHeight());
	refillGrid.hitArea = hit;

	refillGrid.onClick = function(evt) {
		app.grid.refillGrid();
		app.updateCells();
		//evt.target.y = Math.floor(topPadding+gridBottom+app.marginTop);
		//app.redrawRefillGrid();

		var gridBottom = app.cellHeight * app.grid.data.length;
		var buttonPadding = 15;
		var yCoOrd = gridBottom + buttonPadding + app.marginTop;
		this.y = yCoOrd;

		var canvas = document.getElementById("notebooknumbers");
    		canvas.height = yCoOrd+this.getMeasuredHeight()+buttonPadding;
	}
	this.stage.addChild(refillGrid);
}

/*
NotebookNumbers.prototype.redrawCursor = function() {
	var cells = this.grid.cursor.cells;
	for (var i = 0; i < cells.length; i++) {
		var x = cells[i].x;
		var y = cells[i].y;
		var digit = app.grid.data[y][x];
		if (digit == 0) {
			digit = "scribble";
		}
		cells[i].target.image = this.assets[digit];
	}
}*/

function init() {
	app = new NotebookNumbers();
}
