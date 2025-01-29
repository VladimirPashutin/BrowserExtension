"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exchangeWithServer = exports.publishImage = exports.makeTextInput = void 0;
exports.apiUrl = apiUrl;
exports.loginUrl = loginUrl;
exports.getRequestApiInterval = getRequestApiInterval;
var makeTextInput = function (textareaElement, postText) {
    var inputTextEvent = new Event('input', { bubbles: true });
    var changeTextEvent = new Event('change', { bubbles: true });
    var keyupEvent = new KeyboardEvent('keyup', { bubbles: true });
    textareaElement.value = postText;
    textareaElement.dispatchEvent(inputTextEvent);
    textareaElement.dispatchEvent(changeTextEvent);
    textareaElement.dispatchEvent(keyupEvent);
};
exports.makeTextInput = makeTextInput;
var publishImage = function (token, imageElement, imageUrl) { return __awaiter(void 0, void 0, void 0, function () {
    var changeEvent, headers, response, blob, file, dataTransfer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                changeEvent = new Event('change', { bubbles: true });
                headers = new Headers();
                headers.append("Authorization", token);
                headers.append("Content-Type", "application/octet-stream");
                return [4 /*yield*/, fetch(apiUrl() + imageUrl, { "method": "GET", "headers": headers })];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.blob()];
            case 2:
                blob = _a.sent();
                file = new File([blob], 'uploaded-image.png', { type: blob.type });
                dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                imageElement.files = dataTransfer.files;
                imageElement.dispatchEvent(changeEvent);
                return [2 /*return*/];
        }
    });
}); };
exports.publishImage = publishImage;
var exchangeWithServer = function (token_1, method_1, url_1) {
    var args_1 = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args_1[_i - 3] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([token_1, method_1, url_1], args_1, true), void 0, function (token, method, url, body) {
        var headers, response;
        if (body === void 0) { body = undefined; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headers = new Headers();
                    headers.append("Authorization", token);
                    if (!(body === undefined)) return [3 /*break*/, 2];
                    return [4 /*yield*/, fetch(apiUrl() + url, { "method": method, "headers": headers })];
                case 1:
                    response = _a.sent();
                    return [3 /*break*/, 4];
                case 2:
                    headers.append("Content-Type", "application/json");
                    return [4 /*yield*/, fetch(apiUrl() + url, { "method": method, "headers": headers, "body": JSON.stringify(body) })];
                case 3:
                    response = _a.sent();
                    _a.label = 4;
                case 4:
                    if (!response.ok) return [3 /*break*/, 6];
                    return [4 /*yield*/, response.json()];
                case 5: return [2 /*return*/, _a.sent()];
                case 6: return [2 /*return*/, null];
            }
        });
    });
};
exports.exchangeWithServer = exchangeWithServer;
// @ts-ignore
function apiUrl() { return import.meta.env.WXT_API_URL; }
// @ts-ignore
function loginUrl() { return import.meta.env.WXT_AUTH_LOGIN_URL; }
// @ts-ignore
function getRequestApiInterval() { return import.meta.env.WXT_REQUEST_API_INTERVAL; }
