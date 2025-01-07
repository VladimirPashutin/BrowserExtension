
async function doCreateReviewIssue(document) {
    console.log('doCreateReviewIssue');
    const reviewId = document.getElementById('reviewId').value;
    const reviewTime = document.getElementById('reviewTime').value;
    const reviewTimeInt = document.getElementById('reviewTimeInt').value;
    const reviewAuthor = document.getElementById('reviewAuthor').value;
    const reviewRate = document.getElementById('reviewRate').value;
    const reviewText = document.getElementById('reviewText').value;

    const result = await api_service.createReviewIssue(reviewId, reviewAuthor, reviewTimeInt, reviewRate, reviewText);
    if (result) {
        console.log('Review issue created:', result);
        // add the reviewId to the exclude list
        document.getElementById('reviewIds').value += ',' + reviewId;
        // clear the review fields
        document.getElementById('reviewId').value = '';
        document.getElementById('reviewTime').value = '';
        document.getElementById('reviewTimeInt').value = '';
        document.getElementById('reviewAuthor').value = '';
        document.getElementById('reviewRate').value = '';
        document.getElementById('reviewText').value = '';
        document.getElementById('reviewPreview').textContent = '-';

    } else {
        console.error('Error creating review issue');
    }

}

function addCreateReviewIssueButtonListener(document) {
    document.getElementById('createReviewIssue').addEventListener('click', async function () {
        try {
            await doCreateReviewIssue(document);
        } catch (error) {
            console.error('Error calling doCreateReviewIssue:', error);
        }
    });
}