"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloaderTypes = void 0;
var DownloaderTypes;
(function (DownloaderTypes) {
    var Status;
    (function (Status) {
        Status[Status["OK"] = 0] = "OK";
        Status[Status["KO"] = 1] = "KO";
    })(Status = DownloaderTypes.Status || (DownloaderTypes.Status = {}));
    var Options = /** @class */ (function () {
        function Options() {
            this.retry_times = 3;
            this.debug_mode = DebugMode.DEBUG;
            this.output_directory = './download/'; //MUST BE SET IN CASE OF FLAT MODE
        }
        return Options;
    }());
    DownloaderTypes.Options = Options;
    var DebugMode;
    (function (DebugMode) {
        DebugMode[DebugMode["NONE"] = 0] = "NONE";
        DebugMode[DebugMode["DEBUG"] = 1] = "DEBUG";
        DebugMode[DebugMode["LOG"] = 2] = "LOG";
    })(DebugMode = DownloaderTypes.DebugMode || (DownloaderTypes.DebugMode = {}));
})(DownloaderTypes = exports.DownloaderTypes || (exports.DownloaderTypes = {}));
//# sourceMappingURL=downloader_types.js.map