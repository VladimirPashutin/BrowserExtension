async function doGetReview(document) {
    const excludeReviewIds = document.getElementById('reviewIds').value;
    let data = getPageContent(null, excludeReviewIds);
    // console.log('Page content:', data);
    // console.log('reviewAuthor:', data.review.author);
    // console.log('reviewRate:', data.review.rate);
    // console.log('reviewText:', data.review.text);
    // console.log('reviewPreview:', data.review.preview);

    if (data.review !== null) {
        document.getElementById('reviewId').value = data.review.id;
        document.getElementById('reviewTime').value = data.review.time;
        document.getElementById('reviewTimeInt').value = data.review.timeInt;
        document.getElementById('reviewAuthor').value = data.review.author;
        document.getElementById('reviewRate').value = data.review.rate;
        document.getElementById('reviewText').value = data.review.text;
        document.getElementById('reviewPreview').textContent = data.review.preview;
    } else {
        console.log('All reviews have been answered');
        document.getElementById('reviewId').value = '';
        document.getElementById('reviewTime').value = '';
        document.getElementById('reviewTimeInt').value = '';
        document.getElementById('reviewAuthor').value = '';
        document.getElementById('reviewRate').value = '';
        document.getElementById('reviewText').value = '';
        document.getElementById('reviewPreview').textContent = '-';
    }
}

function addGetReviewButtonListener(document) {
    document.getElementById('getReview').addEventListener('click', async function () {
        try {
            await doGetReview(document);
        } catch (error) {
            console.error('Error calling getReview:', error);
        }
    });
}