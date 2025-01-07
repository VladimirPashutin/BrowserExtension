async function doGetResponseReviewIssue(document) {

    const reviewId = document.getElementById('reviewId').value;
    const result = await api_service.getReviewIssue(reviewId);

    if (result) {
        console.log('Review issue:', result);
    } else {
        console.error('Error getting review issue');
    }

    // 'result': {
    //             'id': issue.id,
    //             'status': issue.status,
    //             'review_id': issue.review_id,
    //             'review_time': issue.review_time,
    //             'review_rate': issue.review_rate,
    //             'review_text': issue.review_text,
    //             'company_story': issue.company_story,
    //             'company_response': issue.company_response,
    //         },

    document.getElementById('reviewTime').value = result.review_time;
    document.getElementById('generatedAnswer').value = result.company_response;
    document.getElementById('isIssue').value = true;

    // Fill the review fields from the page data
    const pageContent = getPageContent(reviewId);
    const review = pageContent.review;
    if (review && review.id === reviewId) {
        document.getElementById('reviewPreview').textContent = review.preview;
        document.getElementById('reviewAuthor').value = review.author;
        document.getElementById('reviewRate').value = review.rate;
        document.getElementById('reviewText').value = review.text;
        document.getElementById('reviewTimeInt').value = review.timeInt;
    }

}

function addGetReviewIssueButtonListener(document) {

    document.getElementById('getResponseReviewIssue').addEventListener('click', async function () {
        try {
            await doGetResponseReviewIssue(document);
        } catch (error) {
            console.error('Error calling doGetResponseReviewIssue:', error);
        }
    });

}