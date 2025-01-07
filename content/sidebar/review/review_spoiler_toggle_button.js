
function addReviewSpoilerToggleButtonListener(document) {

    document.getElementById('reviewSpoilerToggleButton').addEventListener('click', function () {

        const reviewSpoiler = document.getElementById('reviewSpoilerSection');
        const reviewSpoilerToggleButton = document.getElementById('reviewSpoilerToggleButton');

        if (reviewSpoiler.style.display === 'none') {
            reviewSpoiler.style.display = 'block';
            reviewSpoilerToggleButton.textContent = 'Review ▲';
        } else {
            reviewSpoiler.style.display = 'none';
            reviewSpoilerToggleButton.textContent = 'Review ▼';
        }
    });
}