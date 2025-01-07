const postAgentStoppedTitle = 'Запустить агента';
const postAgentRunningTitle = 'Остановить агента <span class="spinner"></span>';

const postAgentStatusStorageKey = 'yandexBusinessAIAssistantPostAgentStatus';
const postAgentSleepDuration = 6000; // 10 minute

async function doPostAgentTask(document) {

    // получить последний неопубликованный пост с апи бекенда
    await doGetPost(document);

    // опубликовать пост (публикация не состоится, если пост не найден)
    await doPublishPost(document);

}

function doPostAgentStatusHandler(document) {

    doAgentStatusHandler(
        document,
        postAgentStatusStorageKey,
        'postAgentRunButton',
        postAgentRunningTitle,
        postAgentStoppedTitle,
        postAgentSleepDuration,
        doPostAgentTask,
    );

}


function addPostAgentRunButtonListener(document) {

    addAgentRunButtonListener(
        document,
        postAgentStatusStorageKey,
        'postAgentRunButton',
        postAgentRunningTitle,
        postAgentStoppedTitle,
    );

}

