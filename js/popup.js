




window.addEventListener('message', async (event) => {
    console.log('Received message from Iframe:', event.data);
    if (event.data == 'clear') {
        chrome.storage.local.clear();
    } else {

        await chrome.storage.local.set(event.data)
    }
});

const iframe = document.getElementById('calc-iframe');


// chrome.storage.local.get(null, function (result) {
//     console.log('result', result)

//     if (!result) {
//         chrome.storage.local.set({}, function () {
//             console.log('new storage')
//             iframe.contentWindow.postMessage({}, '*');
//             // Data saved successfully
//         });
//     } else {
//         iframe.contentWindow.postMessage(result, '*');
//     }

// });


iframe.addEventListener('load', () => {
    chrome.storage.local.get(['resBuffer', 'bigger', 'ln', 'secondActive', 'deg', 'memory', 'buffStr'], function (result) {
        console.log('result', result);
        iframe.contentWindow.postMessage(JSON.stringify(result), '*');
        // if (!result) {
        //     chrome.storage.local.set({}, function () {
        //         console.log('new storage');
        //         iframe.contentWindow.postMessage({}, '*');
        //         // Data saved successfully
        //     });
        // } else {
        //     iframe.contentWindow.postMessage(result, '*');
        // }
    });
});