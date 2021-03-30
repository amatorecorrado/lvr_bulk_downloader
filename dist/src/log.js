"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
var index_1 = require("./index");
var Log = /** @class */ (function () {
    function Log() {
    }
    Log.write = function (msg, mode, level) {
        if (mode == index_1.DownloaderTypes.DebugMode.DEBUG || mode == level) {
            console.log("Downloader --> " + msg);
        }
    };
    return Log;
}());
exports.Log = Log;
//# sourceMappingURL=log.js.map