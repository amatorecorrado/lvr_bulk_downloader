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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloaderTypes = exports.Downloader = void 0;
var https = require('https');
var http = require('http');
var fs = require('fs');
var path = require('path');
var downloader_types_1 = require("./downloader_types");
Object.defineProperty(exports, "DownloaderTypes", { enumerable: true, get: function () { return downloader_types_1.DownloaderTypes; } });
var log_1 = require("./log");
var Downloader = /** @class */ (function () {
    function Downloader(options) {
        if (options === void 0) { options = null; }
        this.files = [];
        this.output_files = [];
        this.total_files = 0;
        this.options = new downloader_types_1.DownloaderTypes.Options();
        this.atLeastOne = false;
        if (options)
            this.options = options;
    }
    Downloader.prototype.run = function (files, callback) {
        if (callback === void 0) { callback = null; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (files instanceof downloader_types_1.DownloaderTypes.InputFile) {
                            this.total_files = 1;
                            this.files.push(files);
                        }
                        else {
                            this.total_files = files.length;
                            this.files = files;
                        }
                        return [4 /*yield*/, this.checkAndDownload(callback)];
                    case 1:
                        _a.sent();
                        this.clear();
                        return [2 /*return*/];
                }
            });
        });
    };
    Downloader.prototype.checkAndDownload = function (callback) {
        if (callback === void 0) { callback = null; }
        return __awaiter(this, void 0, void 0, function () {
            var parent, output_file_1, outputDir, outputFileName, error_1, errorCount, retryCount, dowloadedCount;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parent = this;
                        if (!(this.files instanceof Array && this.files.length > 0)) return [3 /*break*/, 6];
                        output_file_1 = new downloader_types_1.DownloaderTypes.OutputFileClass(this.files[0].url, this.files[0].output_path);
                        outputDir = this.options.output_directory;
                        if (output_file_1.path != null) {
                            outputFileName = output_file_1.path;
                        }
                        else {
                            outputFileName = outputDir + path.basename(output_file_1.url);
                        }
                        output_file_1.path = outputFileName;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 5]);
                        return [4 /*yield*/, this.download(output_file_1.url, output_file_1.path).then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                                var dowloadedCount;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            output_file_1.retry_times += 1;
                                            output_file_1.response = response;
                                            if (response.status == downloader_types_1.DownloaderTypes.Status.OK) {
                                                output_file_1.fileInfo = response.message;
                                                response.message = null;
                                                output_file_1.response = response;
                                                parent.files.splice(0, 1)[0]; //REMOVE FROM INPUT
                                                parent.output_files.push(output_file_1);
                                                dowloadedCount = parent.output_files.filter(function (x) { var _a; return ((_a = x.response) === null || _a === void 0 ? void 0 : _a.status) == downloader_types_1.DownloaderTypes.Status.OK; }).length;
                                                log_1.Log.write("File downloaded correctly: " + output_file_1.url, parent.options.debug_mode, downloader_types_1.DownloaderTypes.DebugMode.DEBUG);
                                                log_1.Log.write("Downloaded " + dowloadedCount + " of " + parent.total_files, parent.options.debug_mode, downloader_types_1.DownloaderTypes.DebugMode.LOG);
                                            }
                                            else if (response.status == downloader_types_1.DownloaderTypes.Status.KO && output_file_1.retry_times == parent.options.retry_times) {
                                                parent.files.splice(0, 1)[0]; //REMOVE FROM INPUT
                                                parent.output_files.push(output_file_1);
                                                log_1.Log.write("File skypped: url: " + output_file_1.url + " ,output_path: " + output_file_1.path, parent.options.debug_mode, downloader_types_1.DownloaderTypes.DebugMode.DEBUG);
                                            }
                                            return [4 /*yield*/, parent.checkAndDownload(callback)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        output_file_1.retry_times += 1;
                        output_file_1.response = new downloader_types_1.DownloaderTypes.Response(downloader_types_1.DownloaderTypes.Status.KO, error_1);
                        parent.files.splice(0, 1)[0]; //REMOVE FROM INPUT
                        parent.output_files.push(output_file_1);
                        log_1.Log.write("File skypped: url: " + output_file_1.url + " ,output_path: " + output_file_1.path, parent.options.debug_mode, downloader_types_1.DownloaderTypes.DebugMode.DEBUG);
                        return [4 /*yield*/, parent.checkAndDownload(callback)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        errorCount = parent.output_files.filter(function (x) { var _a; return ((_a = x.response) === null || _a === void 0 ? void 0 : _a.status) == downloader_types_1.DownloaderTypes.Status.KO; }).length;
                        retryCount = parent.output_files.filter(function (x) { return x.retry_times > 1; }).length;
                        dowloadedCount = parent.output_files.filter(function (x) { var _a; return ((_a = x.response) === null || _a === void 0 ? void 0 : _a.status) == downloader_types_1.DownloaderTypes.Status.OK; }).length;
                        log_1.Log.write("Downloaded " + dowloadedCount +
                            " files, " + errorCount +
                            " errors and " + retryCount + " retried", parent.options.debug_mode, downloader_types_1.DownloaderTypes.DebugMode.LOG);
                        //callback(parent.output_files)
                        if (callback != null) {
                            callback(parent.output_files);
                        }
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Downloader.prototype.download = function (url, filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var proto = _this.getProtocol(url);
                        try {
                            var dir = path.dirname(filePath) + "/";
                            fs.mkdir(dir, { recursive: true }, function (err) {
                                if (err)
                                    throw err;
                            });
                            var request = proto.get(url, function (response) {
                                if (response.statusCode !== 200) {
                                    reject(new downloader_types_1.DownloaderTypes.Response(downloader_types_1.DownloaderTypes.Status.KO, response.statusCode));
                                    return;
                                }
                                var fileInfo = {
                                    mime: response.headers['content-type'],
                                    size: parseInt(response.headers['content-length'], 10),
                                };
                                var file = fs.createWriteStream(filePath);
                                response.pipe(file);
                                // The destination stream is ended by the time it's called
                                file.on('finish', function () {
                                    file.close();
                                    resolve(new downloader_types_1.DownloaderTypes.Response(downloader_types_1.DownloaderTypes.Status.OK, fileInfo));
                                });
                                file.on('error', function (err) {
                                    file.close();
                                    fs.unlink(filePath, function () { return reject(new downloader_types_1.DownloaderTypes.Response(downloader_types_1.DownloaderTypes.Status.KO, err)); });
                                });
                            });
                            request.on('error', function (err) {
                                fs.unlink(filePath, function () { return reject(new downloader_types_1.DownloaderTypes.Response(downloader_types_1.DownloaderTypes.Status.KO, err)); });
                            });
                            request.end();
                        }
                        catch (error) {
                            fs.unlink(filePath, function () { return reject(new downloader_types_1.DownloaderTypes.Response(downloader_types_1.DownloaderTypes.Status.KO, error)); });
                        }
                    })];
            });
        });
    };
    Downloader.prototype.getProtocol = function (url) {
        return !url.charAt(4).localeCompare('s') ? https : http;
    };
    Downloader.prototype.clear = function () {
        this.files = [];
        this.output_files = [];
        this.total_files = 0;
    };
    return Downloader;
}());
exports.Downloader = Downloader;
//# sourceMappingURL=index.js.map