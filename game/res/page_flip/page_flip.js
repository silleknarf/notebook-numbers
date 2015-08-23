// Dimensions of the whole book
var BOOK_WIDTH = 630;
var BOOK_HEIGHT = 260;

// Dimensions of one page in the book
var PAGE_WIDTH = 300;
var PAGE_HEIGHT = 250;

// Vertical spacing between the top edge of the book and the papers
var PAGE_Y = (BOOK_HEIGHT - PAGE_HEIGHT) / 2;

// The canvas size equals to the book dimensions + this padding
var CANVAS_PADDING = 30;

var progress = 1;
var target = -1;

var canvas = document.getElementById("pageflip-canvas");
var context = canvas.getContext("2d");
var fillElt = document.getElementById("fill");
var droppedShadowElt = document.getElementById("droppedShadow");
var sharpShadowElt = document.getElementById("sharpShadow");
var progressElt = document.getElementById("progress");
var foldWidthElt = document.getElementById("foldWidth");
var foldXElt = document.getElementById("foldX");

// Resize the canvas to match the book size
canvas.width = BOOK_WIDTH;
canvas.height = BOOK_HEIGHT + (CANVAS_PADDING * 2);

progressElt.addEventListener("change", render, false);

function render() {

    // Reset all pixels in the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Ease progress towards the target value 
    progress = progressElt.value;
    // Strength of the fold is strongest in the middle of the book
    var strength = 1 - Math.abs(progress);

    // Width of the folded paper
    var foldWidth = (PAGE_WIDTH * 0.5) * (1 - progress);

    // X position of the folded paper
    var foldX = PAGE_WIDTH * progress + foldWidth;

    // How far the page should outdent vertically due to perspective
    var verticalOutdent = 20 * strength;

    foldWidthElt.value = foldWidth;
    foldXElt.value = foldX;
    
    context.save();
    context.translate((BOOK_WIDTH / 2), PAGE_Y + CANVAS_PADDING);
    
    drawFoldedPaper(foldX, foldWidth, verticalOutdent, fillElt.checked);


    if (sharpShadowElt.checked) {
        drawSharpShadow(foldX, foldWidth, verticalOutdent, strength);
    }

    if (droppedShadowElt.checked) {
        drawDroppedShadow(foldX, foldWidth, strength);
    }
    
    context.restore();
}


// Draw the folded piece of paper
function drawFoldedPaper(foldX, foldWidth, verticalOutdent, fill) {
    context.beginPath();
    context.moveTo(foldX, 0);
    context.lineTo(foldX, PAGE_HEIGHT);
    context.quadraticCurveTo(foldX, PAGE_HEIGHT + (verticalOutdent * 2), foldX - foldWidth, PAGE_HEIGHT + verticalOutdent);
    context.lineTo(foldX - foldWidth, -verticalOutdent);
    context.quadraticCurveTo(foldX, -verticalOutdent * 2, foldX, 0);

    if (fill) {
        // Gradient applied to the folded paper (highlights & shadows)
        var paperShadowWidth = (PAGE_WIDTH * 0.5) * Math.max(Math.min(1 - progress, 0.5), 0);
        var foldGradient = context.createLinearGradient(foldX - paperShadowWidth, 0, foldX, 0);
        foldGradient.addColorStop(0.35, '#fafafa');
        foldGradient.addColorStop(0.73, '#eeeeee');
        foldGradient.addColorStop(0.9, '#fafafa');
        foldGradient.addColorStop(1.0, '#e2e2e2');
        context.fillStyle = foldGradient;
        context.fill();
    }
    context.strokeStyle = 'rgba(0,0,0,0.06)';
    context.lineWidth = 2;
    context.stroke();
}

// Draw a sharp shadow on the left side of the page
function drawSharpShadow(foldX, foldWidth, verticalOutdent, strength) {
    context.strokeStyle = 'rgba(0,0,0,'+(0.05 * strength)+')';
    context.lineWidth = 30 * strength;
    context.beginPath();
    context.moveTo(foldX - foldWidth, -verticalOutdent * 0.5);
    context.lineTo(foldX - foldWidth, PAGE_HEIGHT + (verticalOutdent * 0.5));
    context.stroke();
}
    
function drawDroppedShadow(foldX, foldWidth, strength) {    
    // Right side drop shadow
    var rightShadowWidth = (PAGE_WIDTH * 0.5) * Math.max(Math.min(strength, 0.5), 0);
    var rightShadowGradient = context.createLinearGradient(foldX, 0, foldX + rightShadowWidth, 0);
    rightShadowGradient.addColorStop(0, 'rgba(0,0,0,'+(strength*0.2)+')');
    rightShadowGradient.addColorStop(0.8, 'rgba(0,0,0,0.0)');
      
    context.fillStyle = rightShadowGradient;
    context.beginPath();
    context.moveTo(foldX, 0);
    context.lineTo(foldX + rightShadowWidth, 0);
    context.lineTo(foldX + rightShadowWidth, PAGE_HEIGHT);
    context.lineTo(foldX, PAGE_HEIGHT);
    context.fill();


    // Left side drop shadow
    var leftShadowWidth = (PAGE_WIDTH * 0.5) * Math.max(Math.min(strength, 0.5), 0);
    var leftShadowGradient = context.createLinearGradient(foldX - foldWidth - leftShadowWidth, 0, foldX - foldWidth, 0);
    leftShadowGradient.addColorStop(0, 'rgba(0,0,0,0.0)');
    leftShadowGradient.addColorStop(1, 'rgba(0,0,0,'+(strength*0.15)+')');
        
    context.fillStyle = leftShadowGradient;
    context.beginPath();
    context.moveTo(foldX - foldWidth - leftShadowWidth, 0);
    context.lineTo(foldX - foldWidth, 0);
    context.lineTo(foldX - foldWidth, PAGE_HEIGHT);
    context.lineTo(foldX - foldWidth - leftShadowWidth, PAGE_HEIGHT);
    context.fill();    
}
