async function checkAuth(document) {
    try {
        let authData = await api_service.checkLogin();
        if (authData.isLogged) {
            document.getElementById('loginStatus').textContent = 'Logged in';
            document.getElementById('apiLoggedIn').value = 'true';
            document.getElementById('apiLogin').value = authData.username;
            document.getElementById('currentUsername').textContent = authData.username;
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById('logoutSection').style.display = 'block';
        }
    } catch (error) {
        await api_service.logout();
        document.getElementById('loginStatus').textContent = 'Login failed';
        document.getElementById('apiLoggedIn').value = 'false';
        document.getElementById('apiLogin').value = '';
        document.getElementById('loginSection').style.display = 'block';
        document.getElementById('logoutSection').style.display = 'none';

        console.log('Login failed:', error);
    }
    update_visibility(document);
}
