document.addEventListener('DOMContentLoaded', function () {
    console.log("Popup DOM content loaded");
    const form = document.getElementById("YandexBusinessAssistanterForm");
    if (form) {
        console.log("Form found, attaching event listener");
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            console.log("Button clicked");
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                console.log("Active tab:", tabs[0]);
                chrome.tabs.sendMessage(tabs[0].id, { action: "getPageContent" }, function (response) {
                    console.log("Response received:", response);
                    if (chrome.runtime.lastError) {
                        console.error("Error sending message:", chrome.runtime.lastError);
                        document.getElementById("result").textContent = "Failed to retrieve page content.";
                    } else if (response && response.data) {
                        document.getElementById("result").textContent = JSON.stringify(response.data, null, 2);
                    } else {
                        document.getElementById("result").textContent = "Failed to retrieve page content.";
                    }
                });
            });
        });
    } else {
        console.error("Form not found");
    }
});