
import {DownloaderTypes} from './index'

export class Log{
    static write(msg: string, mode: DownloaderTypes.DebugMode, level: DownloaderTypes.DebugMode){
        if(mode == DownloaderTypes.DebugMode.DEBUG || mode == level){
            console.log("Downloader --> " + msg);
        }
    }
}