
import {DownloaderTypes} from './index'

export class Log{
    static write(msg: string, mode: DownloaderTypes.DebugMode, level: DownloaderTypes.DebugMode){
        if(mode == DownloaderTypes.DebugMode.DEBUG || mode == level){
            console.log("Downloader --> " + msg);
        }
    }

    static singleFileStats(output_file: DownloaderTypes.OutputFile, output_files: DownloaderTypes.OutputFile[], total_files: number, mode: DownloaderTypes.DebugMode){
        if(output_file.response?.status == DownloaderTypes.Status.OK){

            let dowloadedCount = output_files.filter(x=>x.response?.status == DownloaderTypes.Status.OK).length;
            Log.write("Downloaded " + dowloadedCount + " of " + total_files, mode, DownloaderTypes.DebugMode.LOG)

            Log.write("*** File downloaded correctly ***", mode, DownloaderTypes.DebugMode.DEBUG)
            Log.write("From url: " + output_file.url, mode, DownloaderTypes.DebugMode.DEBUG)
            Log.write("To path: " + output_file.path, mode, DownloaderTypes.DebugMode.DEBUG)
            Log.write("File mime type: " + output_file.fileInfo?.mime, mode, DownloaderTypes.DebugMode.DEBUG)
            Log.write("File size: " + output_file.fileInfo?.size, mode, DownloaderTypes.DebugMode.DEBUG)
            Log.write("*********************************", mode, DownloaderTypes.DebugMode.DEBUG)
         }else{
            Log.write("********** File skypped *********" + output_file.url + " ,output_path: " + output_file.path, mode, DownloaderTypes.DebugMode.DEBUG)
            Log.write("From url: " + output_file.url + " ,output_path: " + output_file.path, mode, DownloaderTypes.DebugMode.DEBUG)
            Log.write("*********************************", mode, DownloaderTypes.DebugMode.DEBUG)
        }
    }

    static allFilesStats(output_files: DownloaderTypes.OutputFile[], total_files: number, mode: DownloaderTypes.DebugMode){
        let errorCount = output_files.filter(x=>x.response?.status == DownloaderTypes.Status.KO).length;
            let retryCount = output_files.filter(x=>x.retry_times > 1).length;
            let dowloadedCount = output_files.filter(x=>x.response?.status == DownloaderTypes.Status.OK).length;

            Log.write("Downloaded "+ dowloadedCount + 
                    " files, " + errorCount + 
                    " errors and " + retryCount + 
                    " retried of total " + total_files + " files", 
                    mode, DownloaderTypes.DebugMode.LOG)
    }
}