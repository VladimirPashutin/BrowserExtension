function initMessageListening() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log("Message received in content script:", request);
        if (request.action === "getPageContent") {
            let pageData = getPageContent();
            console.log("Page content retrieved:", pageData);
            sendResponse({ status: "page content retrieved", data: pageData });
        } else {
            console.log("Unknown action:", request.action);
        }
    });
}