
export module Downloader{
    const https = require('https');
    const http = require('http');
    const fs = require('fs');
    const path = require('path');
        
    export class Downloader{
        files: File[] = [];
        output_files: File[] = [];
        total_files: number = 0;

        options: Options = {
            retry_times: 3,
            mode: Mode.SYNC,
            debug_mode: DebugMode.NONE
        };
        constructor(options: Options){
            this.options = options;
        }
        
        atLeastOne = false;
        async run(files: File[], callback: (files: File[]) => void){
            this.total_files = files.length
            this.files = files

            await this.recorsiveFunction(callback)
            /* for (var index = 0; index < this.files.length; index++) {
                const file = this.files[index];
                var response = await download(file.url, file.path,function(){})
                file.times += 1;
                if(response.status == Status.OK){
                    this.files.splice(index, 1);
                }else if(response.status == Status.KO && file.times == this.times){
                    this.atLeastOne = true;
                    this.files.splice(index, 1);
                }
                if(this.files.length > 0 && index == this.files.length - 1) {
                    index = -1;
                }
            } */
        }

        async recorsiveFunction(callback: (files: File[]) => void){
            const parent = this;
            if(this.files instanceof Array && this.files.length > 0){
                const file = this.files[0];
                //await download(file.url, file.path).then(async (response: any) => {
                await _download(file.url, file.path, async function(response: Response){
                    file.times += 1;
                    file.response = response
                    if(response.status == Status.OK){
                        parent.output_files.push(parent.files.splice(0, 1)[0]);
                        let dowloadedCount = parent.output_files.filter(x=>x.response?.status == Status.OK).length;
                        log("File downloaded correctly: " + file.url, parent.options, DebugMode.DEBUG)
                        log("Downloaded " + dowloadedCount + " of " + parent.total_files, parent.options, DebugMode.LOG)
                    }else if(response.status == Status.KO && file.times == parent.options.retry_times){
                        parent.output_files.push(parent.files.splice(0, 1)[0]);
                        log("File skypped: " + file.url, parent.options, DebugMode.DEBUG)
                    }
                    await parent.recorsiveFunction(callback)
                });
                
            }else{
                let errorCount = parent.output_files.filter(x=>x.response?.status == Status.KO).length;
                let retryCount = parent.output_files.filter(x=>x.times > 1).length;
                let dowloadedCount = parent.output_files.filter(x=>x.response?.status == Status.OK).length;


                log("Downloaded "+ dowloadedCount + 
                " files, " + errorCount + 
                " errors and " + retryCount + " retried", parent.options, DebugMode.LOG)
                //callback(parent.output_files)
                callback(parent.output_files)
            }
        }
    }

    

    /**
     * Downloads file from remote HTTP[S] host and puts its contents to the
     * specified location.
     */
    async function _download(url: String, filePath: String, callback: (resp: Response) => void) {
    const proto = getProtocol(url);
    try {
        var dir = path.dirname(filePath) + "/";
        fs.mkdir(dir, { recursive: true }, (err: any) => {
            if (err) throw err
        });
        var file: any;
        const request = proto.get(url, (resp: any) => {
            if(resp.statusCode !== 200){
                request.end();
                callback(new Response(Status.KO));
                return;
            }
            file = fs.createWriteStream(filePath)
            resp.pipe(file)
            // The destination stream is ended by the time it's called
            file.on('finish', () => {
                file.close()
                callback(new Response(Status.OK));
            });

            /* file.on('close', () => {
                callback(new Response(Status.OK));
            }); */
            
        });

        // The destination stream is ended by the time it's called
        request.on('error', (err: any) => {
            callback(new Response(Status.KO, err));
        });

        file.on('error', (err: any) => {
            file.close()
            fs.unlink(filePath, () => {
                callback(new Response(Status.KO, err));
            });
        });

        request.end();
    } catch (error) {
        callback( new Response(Status.KO, error));
    }

}
async function download(url: String, filePath: String) {
        return new Promise((resolve, reject) => {
            const proto = getProtocol(url);
            try {
                var dir = path.dirname(filePath) + "/";
                fs.mkdir(dir, { recursive: true }, (err: any) => {
                    if (err) throw err;
                });
                var fileInfo: Nullable<DownloaderFileInfo> = null;
                var file: any;
                const request = proto.get(url, function(response: any) {
                    if (response.statusCode !== 200) {
                        reject(new Response(Status.KO, response.statusCode));
                        return;
                    }

                    fileInfo = {
                        mime: response.headers['content-type'],
                        size: parseInt(response.headers['content-length'], 10),
                    };
                    file = fs.createWriteStream(filePath)
                    response.pipe(file);

                    // The destination stream is ended by the time it's called
                    file.on('finish', () => {
                        file.close()
                        resolve(new Response(Status.OK))
                    });

                    file.on('error', (err: any) => {
                        file.close()
                        fs.unlink(filePath, () => reject(new Response(Status.KO, err)));
                    });
                });

                request.on('error', (err: any) => {
                    file.close()
                    fs.unlink(filePath, () => reject(new Response(Status.KO, err)));
                }); 
                request.end();

            } catch (error) {
                fs.unlink(filePath, () => reject(new Response(Status.KO, error)));
            }
        });
    }

    function log(msg: string, options: Options, debug: DebugMode){
        if(options.debug_mode == DebugMode.DEBUG || options.debug_mode == debug){
            console.log("Downloader --> " + msg);
        }
    }

    function getProtocol(url: String){
        return !url.charAt(4).localeCompare('s') ? https : http;
    }


    interface DownloaderFileInfo{
        mime: String
        size: Number
    }

    type Nullable<T> = T | null;

    export interface Options{
        retry_times: number
        mode: Mode
        debug_mode: DebugMode
    }

    export enum DebugMode{
        NONE,
        DEBUG,
        LOG
    }

    export enum Mode{
        SYNC
    }

    export class File{
        url: string
        path: string
        times: number
        response: Response | null
        constructor(u: string, p: string, t: number = 0, r: Response | null = null){
            this.url = u
            this.path = p
            this.times = t
            this.response = r
       }
    }

    export enum Status{
        OK,
        KO
    }

    export class Response {
        status: Status; //OK,KO
        message: any;
        constructor(s: Status, m: any = null){
             this.status = s
             this.message = m
        }
    }


}

