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
    Log.singleFileStats = function (output_file, output_files, total_files, mode) {
        var _a, _b, _c;
        if (((_a = output_file.response) === null || _a === void 0 ? void 0 : _a.status) == index_1.DownloaderTypes.Status.OK) {
            var dowloadedCount = output_files.filter(function (x) { var _a; return ((_a = x.response) === null || _a === void 0 ? void 0 : _a.status) == index_1.DownloaderTypes.Status.OK; }).length;
            Log.write("Downloaded " + dowloadedCount + " of " + total_files, mode, index_1.DownloaderTypes.DebugMode.LOG);
            Log.write("*** File downloaded correctly ***", mode, index_1.DownloaderTypes.DebugMode.DEBUG);
            Log.write("From url: " + output_file.url, mode, index_1.DownloaderTypes.DebugMode.DEBUG);
            Log.write("To path: " + output_file.path, mode, index_1.DownloaderTypes.DebugMode.DEBUG);
            Log.write("File mime type: " + ((_b = output_file.fileInfo) === null || _b === void 0 ? void 0 : _b.mime), mode, index_1.DownloaderTypes.DebugMode.DEBUG);
            Log.write("File size: " + ((_c = output_file.fileInfo) === null || _c === void 0 ? void 0 : _c.size), mode, index_1.DownloaderTypes.DebugMode.DEBUG);
            Log.write("*********************************", mode, index_1.DownloaderTypes.DebugMode.DEBUG);
        }
        else {
            Log.write("********** File skypped *********", mode, index_1.DownloaderTypes.DebugMode.DEBUG);
            Log.write("From url: " + output_file.url, mode, index_1.DownloaderTypes.DebugMode.DEBUG);
            Log.write("*********************************", mode, index_1.DownloaderTypes.DebugMode.DEBUG);
        }
    };
    Log.allFilesStats = function (output_files, total_files, mode) {
        var errorCount = output_files.filter(function (x) { var _a; return ((_a = x.response) === null || _a === void 0 ? void 0 : _a.status) == index_1.DownloaderTypes.Status.KO; }).length;
        var retryCount = output_files.filter(function (x) { return x.retry_times > 1; }).length;
        var dowloadedCount = output_files.filter(function (x) { var _a; return ((_a = x.response) === null || _a === void 0 ? void 0 : _a.status) == index_1.DownloaderTypes.Status.OK; }).length;
        Log.write("Downloaded " + dowloadedCount +
            " files, " + errorCount +
            " errors and " + retryCount +
            " retried of total " + total_files + " files", mode, index_1.DownloaderTypes.DebugMode.LOG);
    };
    return Log;
}());
exports.Log = Log;
//# sourceMappingURL=log.js.map