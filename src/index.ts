const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

import {Options, DebugMode} from './options'
import {InputFile} from './input_file'
import {OutputFile, FileInfo, Response, Status} from './output_file'
import {Log} from './log'
    
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
                    Log.write("File downloaded correctly: " + output_file.url, parent.options.debug_mode, DebugMode.DEBUG)
                    Log.write("Downloaded " + dowloadedCount + " of " + parent.total_files, parent.options.debug_mode, DebugMode.LOG)
                }else if(response.status == Status.KO && output_file.retry_times == parent.options.retry_times){
                    parent.files.splice(0, 1)[0]  //REMOVE FROM INPUT
                    parent.output_files.push(output_file);
                    Log.write("File skypped: " + output_file.url, parent.options.debug_mode, DebugMode.DEBUG)
                }
                await parent.checkAndDownload(callback)
            });
            
        }else{
            let errorCount = parent.output_files.filter(x=>x.response?.status == Status.KO).length;
            let retryCount = parent.output_files.filter(x=>x.retry_times > 1).length;
            let dowloadedCount = parent.output_files.filter(x=>x.response?.status == Status.OK).length;

            Log.write("Downloaded "+ dowloadedCount + 
                    " files, " + errorCount + 
                    " errors and " + retryCount + " retried", 
                    parent.options.debug_mode, DebugMode.LOG)

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
}

export {
    InputFile,
    OutputFile,
    FileInfo,
    DebugMode,
    Options,
    Response,
    Status
}