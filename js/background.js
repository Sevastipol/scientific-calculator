let popupWidth = 387;
let popupHeight = 555;

chrome.runtime.getPlatformInfo(function (info) {
    // Output might be 'win', 'mac', 'linux', etc.
    if (info.os === 'win') {
        popupWidth = 416;
        popupHeight = 577;
    }
});

function createPopupWindow() {
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


function openCalculatorInDetachedMode() {
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
                createPopupWindow();
            }
        });

        // If no windows are open, create the popup window
        if (windows.length === 0) {
            createPopupWindow();
        }
    });
}



// Listen for commands
chrome.commands.onCommand.addListener(function (command) {
    if (command === "open_popup") {
        chrome.action.openPopup()
            .catch(error => {
                console.log("Failed to open popup:", error);
            });
    }
});


// Listen for the extension being installed
chrome.runtime.onInstalled.addListener((details) => {
    // check if it's new install
    if (details.reason == "install") {
        // Open the options page when the extension is installed
        chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
    }


    // Create "Open as Popup Window" menu item
    chrome.contextMenus.create({
        id: "open-popup",
        title: "Detached Mode",
        contexts: ["action"] // This will make it appear when clicking the extension icon
    });
});


// Listen for clicks on the context menu items
chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "open-popup") {
        openCalculatorInDetachedMode();
    }
});


