import {createPinia} from "pinia";
import {createApp} from 'vue';
// @ts-ignore
import App from './App.vue';
import './style.css';

const app = createApp(App);
app.use(createPinia())
app.mount('#app');

export function loginUrl() {
    // @ts-ignore
    return import.meta.env.WXT_AUTH_LOGIN_URL
}
