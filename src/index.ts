const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
    
export class Downloader{
    files: File[] = [];
    output_files: File[] = [];
    total_files: number = 0;

    options = new Options()

    constructor(options: Options | null = null){
        if(options) this.options = options;
    }
    
    atLeastOne = false;
    async run(files: File[], callback: ((files: File[]) => void) | null = null){
        this.total_files = files.length
        this.files = files

        await this.checkAndDownload(callback)
    }

    async checkAndDownload(callback: ((files: File[]) => void) | null = null){
        const parent = this;
        if(this.files instanceof Array && this.files.length > 0){
            const file = this.files[0];

            var outputDir = this.options.output_directory

            var outputFile: string
            if(file.path != null){
                outputFile = file.path
            }else{
                outputFile = outputDir + path.basename(file.url)
            }

            await this.download(file.url, outputFile).then(async (response: any) => {
                file.times += 1;
                file.response = response
                if(response.status == Status.OK){
                    parent.output_files.push(parent.files.splice(0, 1)[0]);
                    let dowloadedCount = parent.output_files.filter(x=>x.response?.status == Status.OK).length;
                    this.log("File downloaded correctly: " + file.url, parent.options, DebugMode.DEBUG)
                    this.log("Downloaded " + dowloadedCount + " of " + parent.total_files, parent.options, DebugMode.LOG)
                }else if(response.status == Status.KO && file.times == parent.options.retry_times){
                    parent.output_files.push(parent.files.splice(0, 1)[0]);
                    this.log("File skypped: " + file.url, parent.options, DebugMode.DEBUG)
                }
                await parent.checkAndDownload(callback)
            });
            
        }else{
            let errorCount = parent.output_files.filter(x=>x.response?.status == Status.KO).length;
            let retryCount = parent.output_files.filter(x=>x.times > 1).length;
            let dowloadedCount = parent.output_files.filter(x=>x.response?.status == Status.OK).length;


            this.log("Downloaded "+ dowloadedCount + 
            " files, " + errorCount + 
            " errors and " + retryCount + " retried", parent.options, DebugMode.LOG)
            //callback(parent.output_files)
            if(callback != null){
                callback(parent.output_files)
            }
        }
    }

    async download(url: String, filePath: String) {
        return new Promise((resolve, reject) => {
            const proto = this.getProtocol(url);
            try {
                var dir = path.dirname(filePath) + "/";
                fs.mkdir(dir, { recursive: true }, (err: any) => {
                    if (err) throw err;
                });
                var file: any;
                const request = proto.get(url, function(response: any) {
                    if (response.statusCode !== 200) {
                        reject(new Response(Status.KO, response.statusCode));
                        return;
                    }

                    const fileInfo: FileInfo = {
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

    log(msg: string, options: Options, debug: DebugMode){
        if(options.debug_mode == DebugMode.DEBUG || options.debug_mode == debug){
            console.log("Downloader --> " + msg);
        }
    }

    getProtocol(url: String){
        return !url.charAt(4).localeCompare('s') ? https : http;
    }

}

interface FileInfo{
    mime: String
    size: Number
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

export class File{
    url: string
    path: string | null
    times: number
    response: Response | null
    constructor(u: string, p: string | null = null, t: number = -1, r: Response | null = null){
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