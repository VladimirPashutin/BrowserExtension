"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var wxt_1 = require("wxt");
// See https://wxt.dev/api/config.html
exports.default = (0, wxt_1.defineConfig)({
    srcDir: 'src',
    outDir: 'dist',
    extensionApi: 'chrome',
    modules: ['@wxt-dev/module-vue'],
    manifest: {
        name: 'BusinessArtificialIntelligence',
        description: 'Расширение для генерации ответов на отзывы и продвижения бизнеса с помощью искусственного интеллекта',
        permissions: ['storage', 'tabCapture', 'tabs', 'activeTab']
    }
});
//# sourceMappingURL=wxt.config.js.map