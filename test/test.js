const {Downloader, InputFile, DebugMode, Status} = require('../dist/src/index')

const fileURL =  "https://storage.googleapis.com/gd-wagtail-prod-assets/original_images/evolving_google_identity_2x1.jpg"

var files =  [
  new InputFile(fileURL, "./download/image.jpg"),
  new InputFile(fileURL, "./download/0/image.jpg"),
  new InputFile(fileURL, "./download/1/image.jpg"),
  new InputFile(fileURL, "./download/2/image.jpg"),
  new InputFile(fileURL, "./download/3/image.jpg"),
  new InputFile(fileURL, "./download/4/image.jpg"),
  new InputFile(fileURL, "./download/5/image.jpg"),
  new InputFile(fileURL, "./download/6/image.jpg"),
  new InputFile(fileURL, "./download/7/image.jpg"),
  new InputFile(fileURL, "./download/8/image.jpg"),
  new InputFile(fileURL, "./download/9/image.jpg")
]


var assert = require('assert');
describe('Bulk download', function() {
  it('Download 11 files', async () => {
    const options = {
        debug_mode: DebugMode.DEBUG
    };
    
    var downloader = new Downloader(options);
    await downloader.run(files, function (output) {
        var errorCount = output.filter(function (x) { var _a; return ((_a = x.response) === null || _a === void 0 ? void 0 : _a.status) == Status.KO; }).length;
        var downloadedCount = output.filter(function (x) { var _a; return ((_a = x.response) === null || _a === void 0 ? void 0 : _a.status) == Status.OK; }).length;
        console.debug("Downloaded " + downloadedCount + " files with " + errorCount + " errors");
        assert.strictEqual(downloadedCount, 11);
      });
  }).timeout(2000);
});