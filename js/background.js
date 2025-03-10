chrome.commands.onCommand.addListener(function (command) {
    if (command === "open_popup") {
        chrome.action.openPopup()
            .catch(error => {
                console.log("Failed to open popup:", error);
            });
    }
});
