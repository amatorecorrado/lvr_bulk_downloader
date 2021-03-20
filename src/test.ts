import { Downloader } from ".";

//const {Downloader} = require('./index')

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

const options = {
    retry_times: 3,
    mode: Downloader.Mode.SYNC,
    debug_mode: Downloader.DebugMode.DEBUG
};

async function test(){
    var downloader = new Downloader.Downloader(options)
    await downloader.run(files, function(output: Downloader.File[]){
        var downloadedCount = output.filter(x=>x.response?.status == Downloader.Status.OK).length;
        let errorCount = output.filter(x=>x.response?.status == Downloader.Status.KO).length;
        console.debug("Downloaded " + downloadedCount + " files with " + errorCount + " errors");
    })
    /* downloader.run(files, function(output: Downloader.File[]){
        var downloadedCount = output.filter(x=>x.response?.status == Downloader.Status.OK).length;
        let errorCount = output.filter(x=>x.response?.status == Downloader.Status.KO).length;
        console.debug("Downloaded " + downloadedCount + " files with " + errorCount + " errors");
    }) */
}

test()