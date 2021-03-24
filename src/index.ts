const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
    
export class Downloader{
    files: InputFile[] = [];
    output_files: OutputFile[] = [];
    total_files: number = 0;

    options = new Options()

    constructor(options: Options | null = null){
        if(options) this.options = options;
    }
    
    atLeastOne = false;
    async run(files: InputFile[] | InputFile, callback: ((files: OutputFile[]) => void) | null = null){
        if(files instanceof InputFile){
            this.total_files = 1
            this.files.push(files)
        }else{  
            this.total_files = files.length
            this.files = files
        }

        await this.checkAndDownload(callback)

        this.clear()
    }

    async checkAndDownload(callback: ((files: OutputFile[]) => void) | null = null){
        const parent = this;
        if(this.files instanceof Array && this.files.length > 0){
            const output_file = new OutputFile(this.files[0].url, this.files[0].path);

            var outputDir = this.options.output_directory

            var outputFileName: string
            if(output_file.path != null){
                outputFileName = output_file.path
            }else{
                outputFileName = outputDir + path.basename(output_file.url)
            }
            output_file.path = outputFileName

            await this.download(output_file.url, output_file.path).then(async (response: any) => {
                output_file.retry_times += 1;
                output_file.response = response
                if(response.status == Status.OK){
                    parent.files.splice(0, 1)[0]  //REMOVE FROM INPUT
                    parent.output_files.push(output_file);
                    let dowloadedCount = parent.output_files.filter(x=>x.response?.status == Status.OK).length;
                    this.log("File downloaded correctly: " + output_file.url, parent.options, DebugMode.DEBUG)
                    this.log("Downloaded " + dowloadedCount + " of " + parent.total_files, parent.options, DebugMode.LOG)
                }else if(response.status == Status.KO && output_file.retry_times == parent.options.retry_times){
                    parent.files.splice(0, 1)[0]  //REMOVE FROM INPUT
                    parent.output_files.push(output_file);
                    this.log("File skypped: " + output_file.url, parent.options, DebugMode.DEBUG)
                }
                await parent.checkAndDownload(callback)
            });
            
        }else{
            let errorCount = parent.output_files.filter(x=>x.response?.status == Status.KO).length;
            let retryCount = parent.output_files.filter(x=>x.retry_times > 1).length;
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

    getProtocol(url: String){
        return !url.charAt(4).localeCompare('s') ? https : http;
    }

    clear() {
        this.files = [];
        this.output_files = [];
        this.total_files = 0;
    }

    log(msg: string, options: Options, debug: DebugMode){
        if(options.debug_mode == DebugMode.DEBUG || options.debug_mode == debug){
            console.log("Downloader --> " + msg);
        }
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

export class InputFile{
    url: string
    path: string | null
    constructor(u: string, p: string | null = null, t: number = -1, r: Response | null = null){
        this.url = u
        this.path = p
    }
}

export class OutputFile{
    url: string
    path: string | null
    retry_times: number
    response: Response | null
    constructor(u: string, p: string | null = null, t: number = -1, r: Response | null = null){
        this.url = u
        this.path = p
        this.retry_times = t
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