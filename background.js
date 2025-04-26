chrome.runtime.onInstalled.addListener(() => {
    console.log('Emotion Detector extension installed.');
});

// Optional: Receive messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received text from content script:", message.text);

    // Here you could fetch your backend to predict emotion
    // fetch('http://localhost:5000/predict', {...})

    sendResponse({ status: "received" });
});
