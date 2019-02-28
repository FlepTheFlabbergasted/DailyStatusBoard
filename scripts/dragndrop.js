
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

	if(dm != null && dm.className == "postit") {
		postitIndex = dm.id[dm.id.length -1];
		AVAIL_POSTIT_INDEXES[postitIndex] = false;
		NR_OF_POSTITS--;
		dm.parentNode.removeChild(dm);
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