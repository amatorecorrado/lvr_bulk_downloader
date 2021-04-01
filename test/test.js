const {Downloader, DownloaderTypes} = require('../dist/src/index')

const fileURL =  "https://storage.googleapis.com/gd-wagtail-prod-assets/original_images/evolving_google_identity_2x1.jpg"

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
    const options = {
        debug_mode: DownloaderTypes.DebugMode.DEBUG
    };
    
    var downloader = new Downloader(options);
    await downloader.run(files, function (output) {
        var errorCount = output.filter(function (x) { var _a; return ((_a = x.response) === null || _a === void 0 ? void 0 : _a.status) == DownloaderTypes.Status.KO; }).length;
        var downloadedCount = output.filter(function (x) { var _a; return ((_a = x.response) === null || _a === void 0 ? void 0 : _a.status) == DownloaderTypes.Status.OK; }).length;
        console.debug("Downloaded " + downloadedCount + " files with " + errorCount + " errors");
        assert.strictEqual(downloadedCount, 11);
      });
  }).timeout(5000);
});