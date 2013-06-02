preload = function() {
	
return
	preload.loadImages = function() {
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
		//this.stage.autoClear = false;
	}

	Preload.prototype.handleFileLoad = function(event) {
		app.assets[event.item.id] = event.result;
	}

	Preload.prototype.handleComplete = function() {
		for (var i = 0; i < app.assets.length; i++) {
			// Log the preloaded files for now
			var item = app.assets[i]; //loader.getResult(id);
			console.log(item);
		}
		app.drawGrid(1024,768);
		app.drawRefillGridButton();
		app.stage.update();
	}
}
