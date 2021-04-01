export namespace DownloaderTypes{
    
    export interface OutputFile{
        url: string 
        path: string | null 
        retry_times: number
        fileInfo: FileInfo | null 
        response: Response | null
    }
    
    export interface Response {
        status: Status;
        message: any;
    }
    
    export enum Status{
        OK,
        KO
    }
    
    export interface FileInfo{
        mime: String
        size: Number
    }
    
    export interface InputFile{
        url: string
        output_path: string | null
    }
    
    export class Options{
        retry_times: number = 3
        debug_mode: DebugMode = DebugMode.LOG
        output_directory: string = './download/' //MUST BE SET IN CASE OF FLAT MODE
    }
    
    export enum DebugMode{
        NONE,
        DEBUG,
        LOG
    }
    
    }