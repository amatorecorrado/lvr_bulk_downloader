export namespace DownloaderTypes{
    export class OutputFileClass implements OutputFile{
        url: string
        path: string | null
        retry_times: number = -1
        fileInfo: FileInfo | null = null
        response: Response | null = null
    
        constructor(u: string, p: string | null = null){
            this.url = u
            this.path = p
        }
    }
    
    export class OutputFile{
        url: string | null = null
        path: string | null = null
        retry_times: number = -1
        fileInfo: FileInfo | null = null
        response: Response | null = null
    }
    
    export class Response {
        status: Status; //OK,KO
        message: any;
        constructor(s: Status, m: any = null){
                this.status = s
                this.message = m
        }
    }
    
    export enum Status{
        OK,
        KO
    }
    
    export interface FileInfo{
        mime: String
        size: Number
    }
    
    export class InputFile{
        url: string
        output_path: string | null
        constructor(u: string, p: string | null = null){
            this.url = u
            this.output_path = p
        }
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