import {defineContentScript} from "wxt/sandbox";
import {createIntegratedUi} from "wxt/client";
import { createApp } from 'vue';
import App from './App.vue';
import '../../style.css';

export default defineContentScript({
    matches: ['*://yandex.ru/sprav/*'],
    main(ctx) {
        const businessAiButtons = createIntegratedUi(ctx,{
            append: 'before',
            position: 'inline',
            anchor: '.Header-UserName',
            onMount: (container) => {
                const app = createApp(App);
                app.mount(container);
                return app;
            },
            onRemove: (app) => { app.unmount(); }
        });
        businessAiButtons.mount();
    }
})
//.EditPage-Right.EditPage-Right_isBusinessBackground