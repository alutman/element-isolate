/*
Empty new tab to display isolated elements
Accepts a ready message (once) with innerHTML content to display
 */

var onMessage = function(msg, sender, sendResponse) {
    if(msg.type === 'ready') {
        // Set the page content
        document.getElementById('content').innerHTML = msg.content;
        document.title = msg.title;
        // Apply modifications
        removeImages(document.getElementById('content'));
        // Remove listener (otherwise new isolates will change this page)
        chrome.runtime.onMessage.removeListener(onMessage);
    }
};

var removeImages = function(node) {
    var lastImg = node.getElementsByTagName("img")[0];
    while(lastImg !== undefined) {
        lastImg.parentElement.removeChild(lastImg);
        lastImg = node.getElementsByTagName("img")[0];
    }
};

chrome.runtime.onMessage.addListener(onMessage);