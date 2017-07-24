/*
Main controller file. Handles toggling the selection mode in the current tab
and creating a new tab when an element is selected; passing html info to the new tab
 */

// Listen to extension button clicks
chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.getSelected(null, function(currentTab) {
        // Tell the active tab script to toggle its state
        chrome.tabs.sendMessage(currentTab.id, {
            type: 'toggle',
            index: currentTab.index //Need to have tabs track their own index
        });
    });

});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if(msg.type === "selected") {
        // Element was selected, create a tab and pass it the element html
        chrome.tabs.create({
            url: "isolated/isolated.html",
            index: msg.index+1 //Index the isolate tab after the tab it was sourced from
        }, function(tab) {
            //TODO remove the need for a timeout
            setTimeout(function(){chrome.runtime.sendMessage({type: 'ready', title: msg.title, content: msg.content})}, 500);
        });
    }
});