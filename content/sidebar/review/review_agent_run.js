const reviewAgentStoppedTitle = 'Запустить агента';
const reviewAgentRunningTitle = 'Остановить агента <span class="spinner"></span>';

const reviewAgentStatusStorageKey = 'yandexBusinessAIAssistantReviewAgentStatus';
const reviewAgentSleepDuration = 6000; // 1 minute

async function doReviewAgentTask(document) {

    // получить решенный инцидент
    await doGetSolvedReviewIssue(document);

    // если ид решенного инцидента заполнен - опубликовать ответ на инцидент
    if (document.getElementById('reviewId').value) {

        // получить данные по инциденту
        await doGetResponseReviewIssue(document);

        // отправить ответ на отзыв
        await doApplyReviewAnswer(document)

    } else {

        // получить инциденты

        // получить последний неотвеченный отзыв, исключая инциденты
        await doGetReview(document);

        // прервать если не удалось
        if (document.getElementById('reviewPreview').textContent === '-') {
            return;
        }

        // если рейтинг отзыва ниже 3 - создать инцидент
        if (document.getElementById('reviewRate').value < 3) {
            await doCreateReviewIssue(document);
            return;
        }

        // сгенерировать ответ на отзыв
        await doReviewResponseGenerate(document);

        // прервать если статус генерации не "done"
        if (document.getElementById('reviewResponsStatus').textContent !== 'Operation status: done') {
            throw new Error('Review response generation failed');
        }

        // отправить ответ на отзыв
        await doApplyReviewAnswer(document)

    }

}

function doReviewAgentStatusHandler(document) {

    doAgentStatusHandler(
        document,
        reviewAgentStatusStorageKey,
        'reviewAgentRunButton',
        reviewAgentRunningTitle,
        reviewAgentStoppedTitle,
        reviewAgentSleepDuration,
        doReviewAgentTask,
    );

    return;

}


function addReviewAgentRunButtonListener(document) {

    addAgentRunButtonListener(
        document,
        reviewAgentStatusStorageKey,
        'reviewAgentRunButton',
        reviewAgentRunningTitle,
        reviewAgentStoppedTitle,
    );

}

