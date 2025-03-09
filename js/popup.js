const iframe = document.getElementById('calc-iframe');

// listen for messages from the iframe
window.addEventListener('message', async (event) => {
    if (event.data?.command == 'clear-storage') {
        chrome.storage.local.clear();
    } else if (event.data?.command == 'set-storage') {
        await chrome.storage.local.set(event.data.storage);
    }
});


// pass paste event to the iframe
document.addEventListener('paste', function (e) {
    // Get clipboard data
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedText = clipboardData.getData('text/plain');
    iframe.contentWindow.postMessage({ type: 'paste', text: pastedText }, '*');
});


// pass storage data to the iframe
iframe.addEventListener('load', () => {
    chrome.storage.local.get(['resBuffer', 'bigger', 'ln', 'secondActive', 'deg', 'memory', 'buffStr'], function (result) {
        iframe.contentWindow.postMessage({ type: 'storage', text: JSON.stringify(result) }, '*');
    });
});