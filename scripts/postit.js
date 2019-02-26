var NR_OF_POSTITS = 0;
const MAX_NR_OF_POSTITS = 8;
var AVAIL_POSTIT_INDEXES = [];
const POSTIT_ID = 0;
const POSTIT_TEXT_ID = 1;
const POSTIT_TEXT = 2;
const POSTIT_POS_LEFT = 3;
const POSTIT_POS_TOP = 4;

function getPostitHTML(postitId, textAreaId, initialText){
	let postitDiv = $('<div class="postit" draggable="true" ondragstart="drag_start(event)" id=' +
	postitId +
	'><textarea id=' + textAreaId +
	'>' + initialText + '</textarea></div>');
	let deleteButton = $('<button id="removePostit">X</button>');
	deleteButton.appendTo(postitDiv);
	return postitDiv;
}

function addPostit(postitId, textAreaId, initialText){
	$('#postitContainer').append(getPostitHTML(postitId, textAreaId, initialText));
}

function addPostitWithPosition(postitId, textAreaId, initialText, posLeft, posTop){
	$('#postitContainer').append(getPostitHTML(postitId, textAreaId, initialText));

	var d = document.getElementById(postitId);
	d.style.position = "absolute";
	d.style.left = posLeft+'px';
	d.style.top = posTop+'px';
}

function allocatePostitIndex(){
    for (var i = 0; i < AVAIL_POSTIT_INDEXES.length; i++) {
        if(AVAIL_POSTIT_INDEXES[i] == false){
			return i;
		}
    }
    return false;
}

function resetPostitIndexAllocation(){
	for(var i = 0; i < MAX_NR_OF_POSTITS; i++){
		AVAIL_POSTIT_INDEXES[i] = false;
	}
}

function createPostitsFromCookies(){
	let postits = Cookies.getJSON('postits');
	if(postits != undefined){
		NR_OF_POSTITS = postits.length;
		for (let i = 0; i < NR_OF_POSTITS; i++) {
			postitIndex = postits[i][POSTIT_ID][postits[i][POSTIT_ID].length -1];
			AVAIL_POSTIT_INDEXES[postitIndex] = true;
			addPostit(postits[i][POSTIT_ID],
									postits[i][POSTIT_TEXT_ID],
									postits[i][POSTIT_TEXT]);
		}
	}
}

function setPostitCookies(){
	let postits = [];
	$('#postitContainer').children('div').each(function () {
		var rect = this.getBoundingClientRect();
		let postit = [this.id, this.children[0].id, this.children[0].value, rect.left, rect.top];
		postits.push(postit);
	});
	Cookies.set('postits', postits);
}

function addPostitEventListener(){
	if(NR_OF_POSTITS < MAX_NR_OF_POSTITS){
		DEBUG_LOG('Adding postit...');
		let initialText = prompt("Text", "Add Your Text Here");
		postitIndex = allocatePostitIndex();
		AVAIL_POSTIT_INDEXES[postitIndex] = true;
		addPostit("postit" + postitIndex, "text" + postitIndex, initialText);
		NR_OF_POSTITS++;
	}else{
		DEBUG_LOG('Max number of postits already added (' + MAX_NR_OF_POSTITS + ')');
		alert("Max number of postits already added...");
	}
}

function removePostitEventListener(){
	let postit = this.parentNode;
	postitIndex = postit.id[postit.id.length -1];
	AVAIL_POSTIT_INDEXES[postitIndex] = false;
	NR_OF_POSTITS--;
	this.parentNode.parentNode.removeChild(postit);
}