async function doGetPost(document) {

    const result = await api_service.getScheduledPost();
    if (result) {
        // 'result': {
        //     'id': post.id,
        //     'image_url': image.url,
        //     'content': post.post_content,
        // },
        let baseUrl = await api_service.getBaseUrl();
        let imageUrl = baseUrl + result.image_url;

        document.getElementById('postId').value = result.id;
        document.getElementById('postImageUrl').value = imageUrl;
        document.getElementById('postText').value = result.content;
    } else {
        console.error('Error getting post');
    }

}

function addGetPostButtonListener(document) {

    document.getElementById('getPostButton').addEventListener('click', async function () {
        try {
            await doGetPost(document);
        } catch (error) {
            console.error('Error calling doGetPost:', error);
        }
    });
}
