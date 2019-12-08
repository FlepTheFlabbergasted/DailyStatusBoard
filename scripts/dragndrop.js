
// Code from: https://stackoverflow.com/questions/6230834/html5-drag-and-drop-anywhere-on-the-screen

function drag_start(event) {
	var style = window.getComputedStyle(event.target, null);
	var str = (parseInt(style.getPropertyValue("left")) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top")) - event.clientY)+ ',' + event.target.id;
	event.dataTransfer.setData("Text",str);
} 

function drop(event) {
	var offset = event.dataTransfer.getData("Text").split(',');
	var dm = document.getElementById(offset[2]);

	if(dm != null && dm.className == "postit") {
		dm.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
		dm.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
	}

	event.preventDefault();
	return false;
}

function drop_trashcan(event) {
	var offset = event.dataTransfer.getData("Text").split(',');
	var dm = document.getElementById(offset[2]);

	/* If it's a postit */
	if(dm != null && dm.className == "postit") {
		postitIndex = dm.id[dm.id.length -1];
		AVAIL_POSTIT_INDEXES[postitIndex] = false;
		NR_OF_POSTITS--;
		dm.parentNode.removeChild(dm);


		let trashcanContainer = document.getElementById("trashcan-container");
		let trashcanImage = document.getElementById("trashcan-image");
		let trashcanContainerPos = trashcanContainer.getBoundingClientRect();
		let trashcanImagePos = trashcanImage.getBoundingClientRect();
		let explosionGif = new Image();

		explosionGif.onload = function() {
			let offset = trashcanImagePos.left - trashcanContainerPos.left;

			explosionGif.style.top = -this.height + 32 + "px"; // 32 is just eyeballing it so it looks nice in the trashcan
			explosionGif.style.left = offset/2 - (this.width / 2) + trashcanImage.clientWidth/2 + "px";

			setTimeout(function() {
				// Theres a bug were the gif doesn't get "reset" and starts some frames in every second or third time
				// https://stackoverflow.com/questions/10730212/proper-way-to-reset-a-gif-animation-with-displaynone-on-chrome
				trashcanContainer.removeChild(explosionGif);
			}, 690); // The gif is 0.7 sec long, remove it after completion (minus 5 cause' the image bugs out otherwise)
		}

		explosionGif.style.position = "absolute";
		explosionGif.src = "assets/trashcan_explosion.gif";

		trashcanContainer.append(explosionGif);
	}

	event.preventDefault();
	event.target.style.border = "";
	return false;
}

function drag_over(event) {
	event.preventDefault();
	return false;
}

function drag_enter(event) {
  	if(event.target.id == "trashcan-container") {
		event.target.style.border = "3px dashed red";
	}
}

function drag_leave(event) {
	if(event.target.id == "trashcan-container") {
		event.target.style.border = "";
	}
}

// TODO: Add eventlisteners to all stuff
/*
var dm = document.getElementById('dragme'); 
dm.addEventListener('dragstart',drag_start,false); 
document.body.addEventListener('dragover',drag_over,false); 
document.body.addEventListener('drop',drop,false); 
*/