import { exit } from "process";
//import { Downloader, DownloaderTypes } from ".";
//import { DebugMode, Downloader, InputFile, Options, OutputFile, Status } from "./index";
//const Downloader = require("./index")
import {Downloader, DownloaderTypes} from "./index"
//import {Downloader, DownloaderTypes} from "./dist/src/index"

const fileURL =  "https://storage.googleapis.com/gd-wagtail-prod-assets/original_images/evolving_google_identity_2x1.jpg"

var files =  [
    {url: fileURL, output_path: "./download/image.jpg"} as DownloaderTypes.InputFile,
    {url: fileURL, output_path: "./download/0/image.jpg"} as DownloaderTypes.InputFile,
    {url: fileURL, output_path: "./download/1/image.jpg"} as DownloaderTypes.InputFile,
    {url: fileURL, output_path: "./download/2/image.jpg"} as DownloaderTypes.InputFile,
    {url: fileURL, output_path: "./download/3/image.jpg"} as DownloaderTypes.InputFile,
    {url: fileURL, output_path: "./download/4/image.jpg"} as DownloaderTypes.InputFile,
    {url: fileURL, output_path: "./download/5/image.jpg"} as DownloaderTypes.InputFile,
    {url: fileURL, output_path: "./download/6/image.jpg"} as DownloaderTypes.InputFile,
    {url: fileURL, output_path: "./download/7/image.jpg"} as DownloaderTypes.InputFile,
    {url: fileURL, output_path: "./download/8/image.jpg"} as DownloaderTypes.InputFile,
    {url: fileURL, output_path: "./download/9/image.jpg"} as DownloaderTypes.InputFile,
]

const options = new DownloaderTypes.Options();
options.output_directory = './download/';
options.debug_mode = DownloaderTypes.DebugMode.DEBUG;
options.retry_times = 3;

async function test(){
    const downloader = new Downloader(options)
     await downloader.run(files, function(output: DownloaderTypes.OutputFile[]){
        var downloadedCount = output.filter(x=>x.response?.status == DownloaderTypes.Status.OK).length;
        let errorCount = output.filter(x=>x.response?.status == DownloaderTypes.Status.KO).length;
        console.debug("Downloaded " + downloadedCount + " files with " + errorCount + " errors");
    })
}

async function easyTest() {
    const files =  [{url: fileURL} as DownloaderTypes.InputFile]
    const downloader = new Downloader()
    await downloader.run(files)
}

async function singleTest() {
    const files = {url: fileURL} as DownloaderTypes.InputFile
    const downloader = new Downloader()
    await downloader.run(files)
}

singleTest()
easyTest()
test()