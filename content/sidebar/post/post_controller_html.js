function getPostControllerHtml() {
    return `
        <div id="postController">

            <button id="getPostButton">Получить пост</button>

            <br>

            <div>
                <label for="postId">Post ID:</label>
                <input type="text" id="postId" name="postId">
            </div>
            <div>
                <label for="postImageUrl">Post Image URL:</label>
                <input type="text" id="postImageUrl" name="postImageUrl">
            </div>
            <div>
                <label for="postText">Post Text:</label>
                <textarea id="postText" name="postText"></textarea>
            </div>

            <br>

            <button id="postPublishButton">Опубликовать пост</button>
            
            <br>
            
            <button id="postAgentRunButton">Запустить агента</button>

        </div>
    `;
}