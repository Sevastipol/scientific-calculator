const popupWidth = 387;
const popupHeight = 555;

function createPopupWindow(popupWidth, popupHeight) {
    chrome.system.display.getInfo((displayInfo) => {
        const displayWidth = displayInfo[0].workArea.width;
        const displayHeight = displayInfo[0].workArea.height;

        // Calculate the centered position
        const left = Math.round((displayWidth - popupWidth) / 2);
        const top = Math.round((displayHeight - popupHeight) / 2);

        // Create the centered popup window
        chrome.windows.create({
            type: "popup",
            url: chrome.runtime.getURL("popup.html"),
            width: popupWidth,
            height: popupHeight,
            left: left,
            top: top,
            focused: true,
        });
    });
}


chrome.commands.onCommand.addListener(function (command) {
    if (command === "open_popup") {
        chrome.action.openPopup()
            .catch(error => {
                console.log("Failed to open popup:", error);
            });
    }
});


chrome.runtime.onInstalled.addListener(() => {
    // Create "Open as Popup Window" menu item
    chrome.contextMenus.create({
        id: "open-popup",
        title: "Open in Detached Mode",
        contexts: ["action"] // This will make it appear when clicking the extension icon
    });
});


// Listen for clicks on the context menu items
chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "open-popup") {

        // Check if the popup is already open
        chrome.windows.getAll({ windowTypes: ["popup"] }, (windows) => {
            let foundPopup = false;

            // Iterate through all windows to check if any window matches the target dimensions
            windows.forEach(window => {
                if (window.width === popupWidth && window.height === popupHeight) {
                    foundPopup = true;
                    chrome.windows.update(window.id, { focused: true });
                }

                // After checking all tabs, if no popup is found, create a new one
                if (!foundPopup && window === windows[windows.length - 1]) {
                    createPopupWindow(popupWidth, popupHeight);
                }

            });

            // If no windows are open, create the popup window
            if (windows.length === 0) {
                createPopupWindow(popupWidth, popupHeight);
            }
        });
    }
});


