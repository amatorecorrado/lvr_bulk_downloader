"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloaderTypes = void 0;
var DownloaderTypes;
(function (DownloaderTypes) {
    var OutputFileClass = /** @class */ (function () {
        function OutputFileClass(u, p) {
            if (p === void 0) { p = null; }
            this.retry_times = -1;
            this.fileInfo = null;
            this.response = null;
            this.url = u;
            this.path = p;
        }
        return OutputFileClass;
    }());
    DownloaderTypes.OutputFileClass = OutputFileClass;
    var OutputFile = /** @class */ (function () {
        function OutputFile() {
            this.url = null;
            this.path = null;
            this.retry_times = -1;
            this.fileInfo = null;
            this.response = null;
        }
        return OutputFile;
    }());
    DownloaderTypes.OutputFile = OutputFile;
    var Response = /** @class */ (function () {
        function Response(s, m) {
            if (m === void 0) { m = null; }
            this.status = s;
            this.message = m;
        }
        return Response;
    }());
    DownloaderTypes.Response = Response;
    var Status;
    (function (Status) {
        Status[Status["OK"] = 0] = "OK";
        Status[Status["KO"] = 1] = "KO";
    })(Status = DownloaderTypes.Status || (DownloaderTypes.Status = {}));
    var InputFile = /** @class */ (function () {
        function InputFile(u, p) {
            if (p === void 0) { p = null; }
            this.url = u;
            this.output_path = p;
        }
        return InputFile;
    }());
    DownloaderTypes.InputFile = InputFile;
    var Options = /** @class */ (function () {
        function Options() {
            this.retry_times = 3;
            this.debug_mode = DebugMode.LOG;
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