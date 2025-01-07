function getSettingsHtml() {
    return `
    <div id="settingController">
        <button id="apiUrlToggle" style="cursor: pointer;">ApiUrl ▼</button>
        <div id="apiUrlSection" style="display: none; margin-top: 10px;">
            <label for="apiUrl">API URL:</label>
            <input type="text" id="apiUrl" name="apiUrl">
            <button id="apiUrlSubmitButton">Submit</button>
        </div>
    </div>
    `;

}