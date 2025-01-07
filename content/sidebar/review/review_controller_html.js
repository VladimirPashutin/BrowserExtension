function getReviewControllerHtml() {
    return `

    <div id="reviewController">
        <br>
        <button id="reviewAgentRunButton">Запустить агента</button>

        <button id="reviewSpoilerToggleButton" style="cursor: pointer;">Отладка агента отзывов  ▼</button>
        <div id="reviewSpoilerSection" style="display: none; margin-top: 10px;">
            <small><b>Инструкция</b></small><br>
            <br>
            <small>Для работы с отзывами:</small><br>
            <small>1. Нажмите кнопку "Получить отзыв" для получения первого отзыва без ответа</small><br>
            <small>2. нажмите кнопку "Сгенерировать ответ на отзыв" или введите ответ на отзыв в поле "Сгенерированный ответ"</small><br>
            <small>3. Текст ответа можно отредактировать перед публикацией в поле "Сгенерированный ответ"</small><br>
            <small>4. Нажмите кнопку "Отправить ответ пользователю" для публикации ответа на отзыв</small><br>
            <br>
            <small>Для работы с отрицательными отзывами:</small><br>
            <small>1. Нажмите кнопку "Получить отзыв" для получения первого отзыва без ответа</small><br>
            <small>2. Если рейтинг отзыва ниже 3, нажмите кнопку "Создать инцидент" для создания инцидента</small><br>
            <small>Первый этап работы с инцидентом на этом окончен.</small><br>
            <small>Отзыв на который создан инцидент будет игнорироваться кнопкой "Получить отзыв"</small><br>
            <br>
            <small>Для работы с решенными инцидентами:</small><br>
            <small>1. Нажмите кнопку "Получить решенный инцидент"</small><br>
            <small>2. Нажмите кнопку "Получить ответ по инциденту" для получения ответа по инциденту</small><br>
            <small>3. Ответ по инциденту будет помещен в поле "Сгенерированный ответ"</small><br>
            <small>4. Нажмите кнопку "Отправить ответ пользователю" для публикации ответа по инциденту</small><br>
            <small>Опубликованные инциденты помечаются на сайте и больше не обрабатываются</small><br>
            <br>

            <button id="getReview">Получить отзыв</button> 

            <br>    
            
            <div>
                <label for="reviewId">Идентификатор:</label>
                <input type="text" id="reviewId" name="reviewId">
            </div>
            <div>
                <label for="reviewTime">Время:</label>
                <input type="text" id="reviewTime" name="reviewTime">
            </div>
            <input type="hidden" id="reviewTimeInt" name="reviewTimeInt">
            <input type="hidden" id="isIssue" name="isIssue">
            <input type="hidden" id="reviewIds" name="reviewIds">
            <div>
                <label for="reviewAuthor">Автор:</label>
                <input type="text" id="reviewAuthor" name="reviewAuthor">
            </div>
            <div>
                <label for="reviewRate">Оценка:</label>
                <input type="number" id="reviewRate" name="reviewRate" min="1" max="5">
            </div>
            <div>
                <label for="reviewText">Текст отзыва:</label>
                <textarea id="reviewText" name="reviewText"></textarea>
            </div>


            <br>    
            
            <button id="reviewResponseGenerateButton">Сгенерировать ответ на отзыв</button>

            <div id = "reviewResponseGenerateHidden" style="display: none;">
                <div id="reviewResponseGenerateStatus">Статус операции: Не начато</div>
                <div>
                    <label for="reviewResponsId">Идентификатор операции:</label>
                    <textarea id="reviewResponsId" name="reviewResponsId"></textarea>
                </div>

                <div id="reviewResponsStatus">Статус операции: Не начато</div>
                <button id="reviewResponseRefreshButton">Проверить статус</button> 
            </div>
            <br>

            <br>
            <h2>Инциденты:</h2>
            <br>
            <button id="createReviewIssue">Создать инцидент</button>
            <button id="getSolvedReviewIssue">Получить решенный инцидент</button>
            <button id="getResponseReviewIssue">Получить ответ по инциденту</button>
            <small>Ответ по инциденту будет помещен в поле "Сгенерированный ответ" и опубликован по кнопке "Отправить ответ пользователю"</small>

            <br>

            <h2>Публикация ответа:</h2>
            <div>
                <label for="generatedAnswer" >Сгенерированный ответ:</label>
                <textarea id="generatedAnswer" name="generatedAnswer"></textarea>
            </div>
        
            <br>
        
            <button id="applyAnswer">Отправить ответ пользователю</button> 

            <br>
            <small><b>Описание работы агента</b></small><br>
            <small>1. Агент обновляет страницу</small><br>
            <small>2. Агент получает решенные инциденты</small><br>
            <small>3.1 Есть решенный инцидент</small><br>
            <small>3.1.1 Агент получает ответ по инциденту</small><br>
            <small>3.1.2 Агент публикует ответ по инциденту</small><br>
            <small>3.2 Нет решенного инцидента</small><br>
            <small>3.2.1 Агент получает првый неотвеченный отзыв</small><br>
            <small>3.2.2 Если отзыв положительный агент генерирует на него ответ и публикует его</small><br>
            <small>3.2.3 Если отзыв отрицательный агент создает инцидент</small><br>
            <small>4. Агент останавливается на 1 минуту</small><br>
            <br>
            <div id="reviewPreview"  style="display: none;">-</div>
        </div>
        


    </div>
    `;
}