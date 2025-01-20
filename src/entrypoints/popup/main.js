"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUrl = loginUrl;
var pinia_1 = require("pinia");
var vue_1 = require("vue");
// @ts-ignore
var App_vue_1 = require("./App.vue");
require("./style.css");
var app = (0, vue_1.createApp)(App_vue_1.default);
app.use((0, pinia_1.createPinia)());
app.mount('#app');
function loginUrl() {
    // @ts-ignore
    return import.meta.env.WXT_AUTH_LOGIN_URL;
}
//# sourceMappingURL=main.js.map