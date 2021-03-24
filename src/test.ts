import { DebugMode, Downloader, InputFile, Options, OutputFile, Status } from ".";

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

const options = new Options();
options.output_directory = './download/';
options.debug_mode = DebugMode.DEBUG;
options.retry_times = 3;

async function test(){
    const downloader = new Downloader(options)
    await downloader.run(files, function(output: OutputFile[]){
        var downloadedCount = output.filter(x=>x.response?.status == Status.OK).length;
        let errorCount = output.filter(x=>x.response?.status == Status.KO).length;
        console.debug("Downloaded " + downloadedCount + " files with " + errorCount + " errors");
    })
}

async function easyTest() {
    const files =  [ new InputFile(fileURL) ]
    const downloader = new Downloader()
    await downloader.run(files)
}

async function singleTest() {
    const files =  new InputFile(fileURL)
    const downloader = new Downloader()
    await downloader.run(files)
}

singleTest()
easyTest()
test()
