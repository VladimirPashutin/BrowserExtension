function getLoginStatusHtml() {

    return `

    <div id="loginStatus">Not logged in</div>
    <div id="loginSection" style="display: block;">
        <div>
            <label for="username">Username:</label>
            <input type="text" id="username" name="username">
        </div>
        <div>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password">
        </div>
        <button id="loginButton">Login</button>
        <br>
    </div>
    <div id="logoutSection" style="display: none;">
        <span id="currentUsername"></span>
        <button id="logoutButton">Logout</button>
    </div>
    <br>
    <!-- Hidden elements -->
    <input type="hidden" id="apiLoggedIn" name="apiLoggedIn" value="false">
    <input type="hidden" id="apiLogin" name="apiLogin" value="">
    `;
}