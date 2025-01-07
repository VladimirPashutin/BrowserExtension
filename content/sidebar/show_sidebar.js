


function showSidebar() {
    let sidebarHtml = getSidebarHtml();
    const sidebarContainer = document.createElement('div');
    sidebarContainer.innerHTML = sidebarHtml;

    document.body.appendChild(sidebarContainer);

    addLoginButtonListener(document);
    addApiUrlCollapsableButtonListener(document);
    addApiUrlSubmitButtonListener(document);

    // Review
    addReviewAgentRunButtonListener(document);
    addReviewSpoilerToggleButtonListener(document);

    addGetReviewButtonListener(document);
    addReviewResponseGenerateButtonListener(document);
    addReviewResponseGenerateStatusButtonListener(document);
    addApplyReviewAnswerButtonListener(document);

    addGetSolvedReviewIssueButtonListener(document);
    addGetReviewIssueButtonListener(document);
    addCreateReviewIssueButtonListener(document);

    // Post
    addGetPostButtonListener(document);
    addPublishPostButtonListener(document);
    addPostAgentRunButtonListener(document);

    checkAuth(document);
    update_visibility(document);

    doReviewAgentStatusHandler(document);
    doPostAgentStatusHandler(document);

}
