"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugMode = exports.Options = void 0;
var Options = /** @class */ (function () {
    function Options() {
        this.retry_times = 3;
        this.debug_mode = DebugMode.LOG;
        this.output_directory = './download/'; //MUST BE SET IN CASE OF FLAT MODE
    }
    return Options;
}());
exports.Options = Options;
var DebugMode;
(function (DebugMode) {
    DebugMode[DebugMode["NONE"] = 0] = "NONE";
    DebugMode[DebugMode["DEBUG"] = 1] = "DEBUG";
    DebugMode[DebugMode["LOG"] = 2] = "LOG";
})(DebugMode = exports.DebugMode || (exports.DebugMode = {}));
//# sourceMappingURL=options.js.map