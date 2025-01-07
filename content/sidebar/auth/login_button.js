function addLoginButtonListener(document) {
    document.getElementById('loginButton').addEventListener('click', async function () {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        try {
            await api_service.login(username, password);
            document.getElementById('loginStatus').textContent = 'Logged in';
            document.getElementById('apiLoggedIn').value = 'true';
            document.getElementById('apiLogin').value = username;
            document.getElementById('currentUsername').textContent = username;
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById('logoutSection').style.display = 'block';
        } catch (error) {
            console.error('Login failed:', error);
            document.getElementById('loginStatus').textContent = 'Login failed';
            document.getElementById('apiLoggedIn').value = 'false';
            document.getElementById('apiLogin').value = '';
            document.getElementById('loginSection').style.display = 'block';
            document.getElementById('logoutSection').style.display = 'none';
        }
        update_visibility(document);
    });

    document.getElementById('logoutButton').addEventListener('click', function () {
        document.getElementById('loginStatus').textContent = 'Not logged in';
        document.getElementById('apiLoggedIn').value = 'false';
        document.getElementById('apiLogin').value = '';
        document.getElementById('currentUsername').textContent = '';
        document.getElementById('loginSection').style.display = 'block';
        document.getElementById('logoutSection').style.display = 'none';

        update_visibility(document);
    });
}

function addApiUrlCollapsableButtonListener(document) {

    const apiUrlToggle = document.getElementById('apiUrlToggle');
    const apiUrlSection = document.getElementById('apiUrlSection');


    apiUrlToggle.addEventListener('click', async function () {

        const apiUrl = await api_service.getApiUrl();
        console.log('apiUrl:', apiUrl);
        document.getElementById('apiUrl').value = apiUrl;

        if (apiUrlSection.style.display === 'none') {
            apiUrlSection.style.display = 'block';
            apiUrlToggle.textContent = 'ApiUrl ▲';
        } else {
            apiUrlSection.style.display = 'none';
            apiUrlToggle.textContent = 'ApiUrl ▼';
        }
    });
}

function addApiUrlSubmitButtonListener(document) {

    document.getElementById('apiUrlSubmitButton').addEventListener('click', async function () {
        const apiUrl = document.getElementById('apiUrl').value;
        await api_service.setApiUrl(apiUrl);
        console.log('apiUrl:', apiUrl);

        apiServiceUrl = await api_service.getApiUrl();
        console.log('apiServiceUrl:', apiServiceUrl);
    });

}
