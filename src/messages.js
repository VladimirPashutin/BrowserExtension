"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInfo = void 0;
exports.getUserInfo = getUserInfo;
var jwt_decode_1 = require("jwt-decode");
var UserInfo = /** @class */ (function () {
    function UserInfo() {
    }
    return UserInfo;
}());
exports.UserInfo = UserInfo;
function getUserInfo(jwt) {
    var result = new UserInfo();
    var userInfo = (0, jwt_decode_1.jwtDecode)(jwt);
    result.communities = userInfo["communities"];
    result.application = 'business-ai';
    result.name = userInfo["userName"];
    result.roles = userInfo["roles"];
    return result;
}
//# sourceMappingURL=messages.js.map