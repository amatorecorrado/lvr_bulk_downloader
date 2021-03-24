
import {DebugMode} from './options'

export class Log{
    static write(msg: string, mode: DebugMode, level: DebugMode){
        if(mode == DebugMode.DEBUG || mode == level){
            console.log("Downloader --> " + msg);
        }
    }
}