"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
exports.default = defineContentScript({
    matches: ['*://*.google.com/*'],
    main: function () {
        console.log('Hello content.');
    },
});
//# sourceMappingURL=content.js.map