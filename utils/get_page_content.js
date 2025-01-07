function getPageContent(reviewId = null, excludeReviewIds = '') {
    let pageHTML = document.body.outerHTML;
    let dom = new DOMParser().parseFromString(pageHTML, "text/html");

    let data = extractPreloadData(dom);
    let review = firstUnansweredReview(data, reviewId, excludeReviewIds);

    return {
        page_content: data,
        review: review
    };

    return parseDocumentForData(dom);
}

function firstUnansweredReview(data, reviewId = null, excludeReviewIds = '') {
    if (!data
        || !data.initialState
        || !data.initialState.edit
        || !data.initialState.edit.reviews
        || !data.initialState.edit.reviews.list
        || !Array.isArray(data.initialState.edit.reviews.list.items)) {
        console.error('Invalid data format');
        return null;
    }

    let result = null;

    for (const review of data.initialState.edit.reviews.list.items) {
        if (excludeReviewIds.includes(review.id)) {
            continue;
        }
        if (reviewId && review.id === reviewId) {
            let timeInt = review.time_created;
            let time = new Date(timeInt);
            result = {
                'id': review.id,
                'time': time,
                'timeInt': timeInt,
                'author': review.author.user,
                'rate': review.rating,
                'text': review.full_text,
                'preview': review.snippet
            };
            break;
        } else if (!review.owner_comment) {
            let timeInt = review.time_created;
            let time = new Date(timeInt);
            result = {
                'id': review.id,
                'time': time,
                'timeInt': timeInt,
                'author': review.author.user,
                'rate': review.rating,
                'text': review.full_text,
                'preview': review.snippet
            };
            break;
        }
    }

    if (result) {
        // console.log('Found review:', result);
    } else {
        console.log('All reviews have been answered');
    }

    return result;
}