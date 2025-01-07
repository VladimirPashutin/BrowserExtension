## Project Description

**Яндекс.Бизнес помощник** is a Chrome extension designed to assist users with managing their business reviews on Yandex. The extension provides a sidebar interface that allows users to log in, ping the server, generate responses to reviews, and apply those responses directly on the Yandex reviews page. The extension interacts with a backend API to perform various operations and uses Chrome's local storage to manage authentication tokens.

## Features

- **Login**: Allows users to log in using their username and password.
- **Ping**: Sends a ping request to the server and displays the operation status.
- **Review Management**: Retrieves reviews, generates responses using AI, and applies the responses directly on the Yandex reviews page.
- **Status Indicators**: Displays the status of various operations.

## Project Structure

```
yandex_ai_front_end/
├── manifest.json
├── content/
│   ├── content.js
│   ├── sidebar/
│   │   ├── sidebar_html.js
│   │   ├── show_sidebar.js
│   │   └── sidebar.css
│   ├── init_message_listening.js
│   └── popup.html
├── utils/
│   ├── preload_data.js
│   └── get_page_content.js
├── services/
│   └── api_service.js
├── tests/
│   ├── example_page.html
│   └── example_page_data.json
└── README.md
```

## How to Run the Extension

1. **Clone the Repository**: Clone the repository to your local machine using the following command:
    ```sh
    git clone https://github.com/Alienjob/yandex_ai_front_end.git
    ```

2. **Navigate to the Extension Directory**:
    ```sh
    cd yandex_ai_front_end
    ```

3. **Open Chrome Extensions Page**: Open the Chrome browser and navigate to the extensions page:
    ```
    chrome://extensions/
    ```

4. **Enable Developer Mode**: Enable developer mode by toggling the switch in the top right corner of the extensions page.

5. **Load Unpacked Extension**: Click on the "Load unpacked" button and select the directory where you cloned the repository (`yandex_ai_front_end`).

6. **Verify Installation**: The extension should now appear in the list of installed extensions. You can click on the extension icon to open the sidebar interface.

## Usage

### Backend API

- This extension requires a backend API to perform various operations.
- The backend API code can be found in the following repository: [yandex_ai_backend](https://github.com/Alienjob/yandex_ai_back_end)
- Ensure that the backend API is running and accessible.
- Create user account on backend API and use the same credentials to login in the extension. 

### Login

- Enter your username and password in the respective fields.
- Click the "Login" button to authenticate.

### Ping

- Click the "Ping" button to send a ping request to the server.
- The operation status will be displayed below the button.

### Review Management

- Click the "Получить отзыв" button to retrieve the first unanswered review.
- Check and edit review details (author, rate, review text) and click "Сгенерировать ответ на отзыв" to generate a response.
- Refresh status by clicking "Проверить статус" button after small delay.
- The generated answer will be displayed in the "Generated Answer" field.
- Click "Отправить ответ пользователю" to apply the generated answer to the review.

## Summary

This Chrome extension provides a convenient interface for managing business reviews on Yandex. By following the steps above, you can install and run the extension in your Chrome browser, allowing you to log in, ping the server, generate responses to reviews, and apply those responses directly on the Yandex reviews page.
