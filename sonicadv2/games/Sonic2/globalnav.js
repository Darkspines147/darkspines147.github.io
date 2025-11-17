/* 
	Copyright (c) 2002-2003 Macromedia, Inc. 
	globalnav scripts	
	Language: JavaScript 1.2
*/

var calculatedOffset;

function getElementOffset(element) {
	calculatedOffset = 0;
	if (element != null)	{
		elementOffset = calculateOffset_Y(element);
	}
	return elementOffset;
}

function calculateOffset_Y(element) {
	if (element != null)	{
		calculatedOffset += element.offsetTop;
		if (element.offsetParent) {
			if ((element.offsetParent == document.body) || 
					(element.offsetParent.tagName == ('HTML'||'BODY'))) {	
				return calculatedOffset;
			} else {
				return calculateOffset_Y(element.offsetParent);
			}
		} else {
			return calculatedOffset;
		}
	}
}

function isOverlapped(element,minOffset) {
	var overlapped;
	if (element && minOffset) {
		var offset = getElementOffset(element);
		overlapped = ((offset < minOffset) ? true : false);
	}
	return overlapped;
}

function checkIsFlash(element) {
	var isFlash;
	var type = element.type.toLowerCase();
	var codebase = element.getAttribute('codebase');			
	if ((type.indexOf('flash') != -1) || 
			(codebase.indexOf('swflash.cab') != -1)) {
		isFlash = true;
	} else {
		isFlash = false;
	}
	return isFlash;
}

function setVisibilityOnOverlap(elements,minOffset) {
	if (elements && minOffset) {
		for (var i=0; i < elements.length; i++) {
			var currentElement = elements[i];
			if ((checkIsFlash(currentElement) == false) && 
					(isOverlapped(currentElement,minOffset) == true)) {
				currentElement.style.visibility = 'hidden';
			} else {
				currentElement.style.visibility = 'visible';
			}
		}
	}
}


function setFormVisibilityOnOverlap(minOffset) {
	if (minOffset != null) {
		for (var i=0; i < document.forms.length; i++) {
			var currentForm = document.forms[i];
			for (var j=0; j < currentForm.elements.length; j++) {
				var currentElement = currentForm.elements[j];
				if (isOverlapped(currentElement,minOffset) == true) {
					if (currentElement.type.indexOf('select') != -1) {
						currentElement.style.visibility = 'hidden';
					} else {
						currentElement.disabled = true;
					}
				} else {
					currentElement.style.visibility = 'visible';
					currentElement.disabled = false;
				}
			} 
		}
	}
}

function checkElementOverlap(minOffset) {
	var docObjects = document.getElementsByTagName('object');
	setVisibilityOnOverlap(docObjects,minOffset);
	setVisibilityOnOverlap(document.embeds,minOffset);
	setFormVisibilityOnOverlap(minOffset);
}

function setSWFHeight(h) {
	if (this.swf_object != null) {
		this.swf_object.setAttribute('height',h);
	}	
	if (this.swf_embed != null) {
		this.swf_embed.setAttribute('height',h);
	}
}

function expandNav(h) {
	this.checkElements(h);
	this.myDIV.style.height = h+'px';
	this.setSWFHeight(h);
}

function colapseNav(h) {
	this.setSWFHeight(h)
	this.myDIV.style.height = h+'px';
	this.checkElements(h);
}

function setHeight(h,overlap) {
	if (h != null) {
		if ((overlap == null) || (overlap == true)) {
			(this.currentHeight < h) ? this.expandNav(h) : this.colapseNav(h);
		} 
		else if (overlap == false) {	
			positionContent(h);
			this.setSWFHeight(h);
		}
		this.currentHeight = h;
	}
}

GlobalNav = function(swf,height) {
	/* properties */
	this.swf = swf;
	this.swf_object = document.getElementById('mmglobalnav_object');
	this.swf_embed = document.getElementById('mmglobalnav_embed');
	this.myDIV = document.getElementById('globalnav');
	this.currentHeight = (height ? height : this.swf_object.height);
	/* methods */
	this.checkElements = checkElementOverlap;
	this.setSWFHeight = setSWFHeight;
	this.setHeight = setHeight;
	this.colapseNav = colapseNav;
	this.expandNav = expandNav;
}

// called by globalnav.swf 
// sets the mediapref cookie
function setFlash(flash_version_string) {
	var pixelName = 'flash_pixel';
	if (document[pixelName] && flash_version_string) {
		document[pixelName].src = '/set_media_pref?'+flash_version_string;
	}
}

//
var mmglobalnav;
//
function initGlobalNav(swf,h) {
	if (document.getElementById('mmglobalnav_object') || 
			document.getElementById('mmglobalnav_embed')) {
		mmglobalnav = new GlobalNav(swf,h);
		if (h == null) h = mmglobalnav.currentHeight;
		window.setTimeout('mmglobalnav.setHeight('+h+',false)',200);
	}
}

function positionContent(y) {
	if (y != null) {
		var contentBox = document.getElementById('contentWrapper');
		contentBox.style.top = y + 'px';
	}
}

function adjustForGlobalMessaging() {
	if (document.getElementById('globalmessaging') && 
			document.getElementById('globalmessage')) {
		var message_gif = document.getElementById('globalmessage');
		var y = 64 + message_gif.height + 8; // globalnav gifs + message gif + margin
		positionContent(y);
	}
}

function defineFunctions() {
	if (!document.getElementById) {
		if (document.layers) document.getElementById = function() { return; }
		if (document.all) document.getElementById = function(str) { return document.all[str]; }
	}
}

function initPage() {
	defineFunctions();
	initGlobalNav('globalnav.swf',64);// Flash version of globalnav only 
	adjustForGlobalMessaging();				// GIF version of globalnav only
}

/* END */