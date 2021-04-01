const {Downloader, DownloaderTypes} = require('../dist/src/index')

const fileURL =  "https://storage.googleapis.com/gd-wagtail-prod-assets/original_images/evolving_google_identity_2x1.jpg"
const wrongFileURL =  "https://storage.googleapis.com/gd-wagtail-prod-assets/original_images/evolving_google_identity_2x1_WRONG.jpg"

var files =  [
  {url: fileURL, output_path: "./download/image.jpg"},
  {url: fileURL, output_path: "./download/0/image.jpg"},
  {url: fileURL, output_path: "./download/1/image.jpg"},
  {url: fileURL, output_path: "./download/2/image.jpg"},
  {url: fileURL, output_path: "./download/3/image.jpg"},
  {url: fileURL, output_path: "./download/4/image.jpg"},
  {url: fileURL, output_path: "./download/5/image.jpg"},
  {url: fileURL, output_path: "./download/6/image.jpg"},
  {url: fileURL, output_path: "./download/7/image.jpg"},
  {url: fileURL, output_path: "./download/8/image.jpg"},
  {url: fileURL, output_path: "./download/9/image.jpg"},
]


var assert = require('assert');
describe('Bulk download', function() {
  it('Download 11 files', async () => {
    var downloader = new Downloader();
    await downloader.run(files, function (output) {
        var errorCount = output.filter(function (x) { var _a; return ((_a = x.response) === null || _a === void 0 ? void 0 : _a.status) == DownloaderTypes.Status.KO; }).length;
        var downloadedCount = output.filter(function (x) { var _a; return ((_a = x.response) === null || _a === void 0 ? void 0 : _a.status) == DownloaderTypes.Status.OK; }).length;
        console.debug("Downloaded " + downloadedCount + " files with " + errorCount + " errors");
        assert.strictEqual(downloadedCount, 11);
      });
  }).timeout(5000);
});

var assert = require('assert');
describe('Bulk download', function() {
  it('Error 1 files', async () => {
    const files = {url: wrongFileURL}
    const downloader = new Downloader()
    await downloader.run(files,function (output) {
      var errorCount = output.filter(function (x) { var _a; return ((_a = x.response) === null || _a === void 0 ? void 0 : _a.status) == DownloaderTypes.Status.KO; }).length;
      assert.strictEqual(errorCount, 1);
    });
  }).timeout(2000);
});