/*
content_script injected to each normal page, ready to highlight and mark elements.
Listens for toggle events from background to enable the selection mode
On click, sends an event with the innerHTML to display.

Thanks to blade.sk (jcgpghgjhhahcefnfpbncdmhhddedhnk) for the general logic
 */

// Turn off any styles and remove listeners
var deactivate = function() {
    active = false;
    if(lastElem !==  null) {
        lastElem.style.outline = "";
        lastElem.style.outlineOffset = "";
    }
    document.removeEventListener('mouseover', highlightElement);
    document.removeEventListener('click',openElement);
};

// Add in the listeners
var activate = function() {
    active = true;
    document.addEventListener('mouseover', highlightElement);
    document.addEventListener('click',openElement);
};

// Notify background that an element has been selected to be created in a tab
var openElement  = function(mouseEvent) {
    var elem = mouseEvent.toElement;
    chrome.runtime.sendMessage({type: 'selected', index: index, content: elem.innerHTML, title: document.title});
    deactivate(); // We're done here
};

var lastElem = null;
// Adds an outline to the element currently hovered over
var highlightElement = function(mouseEvent) {
    var elem = mouseEvent.toElement;
    if(lastElem !==  null && lastElem.style) {
        lastElem.style.outline = "";
        lastElem.style.outlineOffset = "";
    }
    if(elem.style) {
        elem.style.outline = "solid 6px rgba(0,255,100,0.5)";
        elem.style.outlineOffset = "-4px";
    }
    lastElem = elem;
};

var active = false;
var index = 0;
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if(msg.type === "toggle") {
        // Received toggle event from background
        index = msg.index;
        if(active) {
            deactivate();
        }
        else {
            activate();
        }
    }
});

