async function doApplyReviewAnswer(document) {
    // Check if it is an issue and mark it as published on the backend
    if (document.getElementById('isIssue').value === 'true') {
        const reviewId = document.getElementById('reviewId').value;
        await api_service.markIssueAsPublished(reviewId);
    }

    let etalonText = document.getElementById('reviewPreview').textContent.toLowerCase().replaceAll(' ', '').replaceAll('\n', '');

    // find elements by class "Review"
    let reviewElements = document.getElementsByClassName('Review');

    let targetReview = null;

    // iterate over elements
    for (let reviewElement of reviewElements) {
        // find elements by class "Review-Text"
        let reviewTextElement = reviewElement.getElementsByClassName('Review-Text')[0];
        // if text of reviewTextElement contains etalon text then this is target review
        let reviewText = reviewTextElement.textContent.toLowerCase().replaceAll(' ', '').replaceAll('\n', '');

        if (reviewText.includes(etalonText)) {
            targetReview = reviewElement;
            break;
        }
    }

    if (targetReview === null) {
        console.error('Target review not found');
        return;
    }

    // find elements textarea withing target review
    let answerElement = targetReview.getElementsByTagName('textarea')[0];

    // fill answerElement with generated answer
    answerElement.value = document.getElementById('generatedAnswer').value;

    // Simulate user input to trigger any event listeners
    const event = new InputEvent('input', {
        bubbles: true,
        cancelable: true,
        data: answerElement.value
    });
    answerElement.dispatchEvent(event);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // find button "Send" within target review
    let sendButton = targetReview.getElementsByClassName('BusinessResponseDraft-SendButton')[0];

    // click on send button
    sendButton.click();

}

function addApplyReviewAnswerButtonListener(document) {
    document.getElementById('applyAnswer').addEventListener('click', async function () {
        try {
            await doApplyReviewAnswer(document);
        } catch (error) {
            console.error('Error calling applyAnswer:', error);
        }
    });
}