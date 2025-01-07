function getSidebarHtml() {
    return `
<div id="mySidebar">
    ${getSettingsHtml()}
    ${getLoginStatusHtml()}
    <h1>AI помощник</h1>
    
    ${getReviewControllerHtml()}
    ${getPostControllerHtml()}
    <!-- Empty space at the bottom -->
    <div style="height: 50px;"></div>
</div>
`};