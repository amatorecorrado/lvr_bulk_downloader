const {Downloader} = require('../dist/src/index')

const fileURL =  "https://storage.googleapis.com/gd-wagtail-prod-assets/original_images/evolving_google_identity_2x1.jpg"

var files =  [
  new Downloader.File(fileURL, "./download/image.jpg"),
  new Downloader.File(fileURL, "./download/0/image.jpg"),
  new Downloader.File(fileURL, "./download/1/image.jpg"),
  new Downloader.File(fileURL, "./download/2/image.jpg"),
  new Downloader.File(fileURL, "./download/3/image.jpg"),
  new Downloader.File(fileURL, "./download/4/image.jpg"),
  new Downloader.File(fileURL, "./download/5/image.jpg"),
  new Downloader.File(fileURL, "./download/6/image.jpg"),
  new Downloader.File(fileURL, "./download/7/image.jpg"),
  new Downloader.File(fileURL, "./download/8/image.jpg"),
  new Downloader.File(fileURL, "./download/9/image.jpg")
]


var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', async () => {
      const options = {
          retry_times: 3,
          mode: Downloader.Mode.SYNC,
          debug_mode: Downloader.DebugMode.DEBUG
      };
      
      var downloader = new Downloader.Downloader(options);
      downloader.run(files, function (output) {
          var errorCount = output.filter(function (x) { var _a; return ((_a = x.response) === null || _a === void 0 ? void 0 : _a.status) == Downloader.Status.KO; }).length;
          var downloadedCount = output.filter(function (x) { var _a; return ((_a = x.response) === null || _a === void 0 ? void 0 : _a.status) == Downloader.Status.OK; }).length;
          console.debug("Downloaded " + downloadedCount + " files with " + errorCount + " errors");
          assert.strictEqual(downloadedCount, 10);
        });
    });
  });
});