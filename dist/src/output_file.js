"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = exports.Response = exports.OutputFile = void 0;
var OutputFile = /** @class */ (function () {
    function OutputFile(u, p) {
        if (p === void 0) { p = null; }
        this.retry_times = -1;
        this.fileInfo = null;
        this.response = null;
        this.url = u;
        this.path = p;
    }
    return OutputFile;
}());
exports.OutputFile = OutputFile;
var Response = /** @class */ (function () {
    function Response(s, m) {
        if (m === void 0) { m = null; }
        this.status = s;
        this.message = m;
    }
    return Response;
}());
exports.Response = Response;
var Status;
(function (Status) {
    Status[Status["OK"] = 0] = "OK";
    Status[Status["KO"] = 1] = "KO";
})(Status = exports.Status || (exports.Status = {}));
//# sourceMappingURL=output_file.js.map