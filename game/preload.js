<<<<<<< HEAD
var preload = function() {
    var p = this;
	p.loadImages = function() {
		var manifest = [{src:'app/img/scribble.png', id: 'scribble'}]; 
		for (var i = 1; i <= 9; i++) {
			var digit = i;
			var image = 'app/img/'+digit+'.png';
			manifest.push({src: image, id: digit});
		}
		var loader = new createjs.LoadQueue();
		loader.addEventListener("fileload", this.handleFileLoad);
		loader.addEventListener("complete", this.handleComplete);
		loader.loadManifest(manifest);
		//this.stage.autoClear = false;
	}

	p.prototype.handleFileLoad = function(event) {
		app.assets[event.item.id] = event.result;
	}

	p.prototype.handleComplete = function() {
		for (var i = 0; i < app.assets.length; i++) {
			// Log the preloaded files for now
			var item = app.assets[i]; //loader.getResult(id);
			console.log(item);
		}
		app.drawGrid(1024,768);
		app.drawRefillGridButton();
		app.stage.update();
	}

    return p;
}
=======
var preload = function() {
    var p = this;
	p.loadImages = function() {
		var manifest = [{src:'app/img/scribble.png', id: 'scribble'}]; 
		for (var i = 1; i <= 9; i++) {
			var digit = i;
			var image = 'app/img/'+digit+'.png';
			manifest.push({src: image, id: digit});
		}
		var loader = new createjs.LoadQueue();
		loader.addEventListener("fileload", this.handleFileLoad);
		loader.addEventListener("complete", this.handleComplete);
		loader.loadManifest(manifest);
		//this.stage.autoClear = false;
	}

	p.prototype.handleFileLoad = function(event) {
		app.assets[event.item.id] = event.result;
	}

	p.prototype.handleComplete = function() {
		for (var i = 0; i < app.assets.length; i++) {
			// Log the preloaded files for now
			var item = app.assets[i]; //loader.getResult(id);
			console.log(item);
		}
		app.drawGrid(1024,768);
		app.drawRefillGridButton();
		app.stage.update();
	}

    return p;
}
>>>>>>> 127b9bab58ee885d67b9cd25fa162e33683b29a1
