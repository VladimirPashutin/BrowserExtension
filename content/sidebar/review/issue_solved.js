async function doGetSolvedReviewIssue(document) {

    const result = await api_service.getIssueAll();
    if (result) {
        console.log('All review issues:', result);
        const issueIds = result.map(issue => issue.review_id).join(',');
        document.getElementById('reviewIds').value = issueIds;
        console.log('All review issue IDs:', issueIds);
    } else {
        console.error('Error getting solved review issue');
    }

    // Clear fields related to the review issue and the review itself

    document.getElementById('reviewTime').value = '';
    document.getElementById('generatedAnswer').value = '';
    document.getElementById('isIssue').value = '';
    document.getElementById('reviewPreview').textContent = '-';
    document.getElementById('reviewAuthor').value = '';
    document.getElementById('reviewRate').value = '';
    document.getElementById('reviewText').value = '';
    document.getElementById('reviewTimeInt').value = '';

    const solved = result.filter(issue => issue.status === 'resolved');
    if (solved.length > 0) {
        const issue = solved[0];
        document.getElementById('reviewId').value = issue.review_id;
    } else {
        document.getElementById('reviewId').value = '';
        console.log('No solved review issue found');
    }

}

function addGetSolvedReviewIssueButtonListener(document) {

    document.getElementById('getSolvedReviewIssue').addEventListener('click', async function () {
        try {
            await doGetSolvedReviewIssue(document);
        } catch (error) {
            console.error('Error calling doGetSolvedReviewIssue:', error);
        }
    });

}