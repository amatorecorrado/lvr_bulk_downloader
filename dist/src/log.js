"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
var options_1 = require("./options");
var Log = /** @class */ (function () {
    function Log() {
    }
    Log.write = function (msg, mode, level) {
        if (mode == options_1.DebugMode.DEBUG || mode == level) {
            console.log("Downloader --> " + msg);
        }
    };
    return Log;
}());
exports.Log = Log;
//# sourceMappingURL=log.js.map