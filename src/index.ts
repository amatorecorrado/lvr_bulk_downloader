const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

import { DownloaderTypes } from './downloader_types';
import {Log} from './log'
 
export class Downloader{
    files: DownloaderTypes.InputFile[] = [];
    output_files: DownloaderTypes.OutputFile[] = [];
    total_files: number = 0;

    options = new DownloaderTypes.Options()

    constructor(options: DownloaderTypes.Options | null = null){
        if(options) this.options = options;
    }
    
    atLeastOne = false;
    async run(files: DownloaderTypes.InputFile[] | DownloaderTypes.InputFile, callback: ((files: DownloaderTypes.OutputFile[]) => void) | null = null){
        if(files instanceof DownloaderTypes.InputFile){
            this.total_files = 1
            this.files.push(files)
        }else{  
            this.total_files = files.length
            this.files = files
        }

        await this.checkAndDownload(callback)

        this.clear()
    }

    async checkAndDownload(callback: ((files: DownloaderTypes.OutputFile[]) => void) | null = null){
        const parent = this;
        if(this.files instanceof Array && this.files.length > 0){
            const output_file = new DownloaderTypes.OutputFileClass(this.files[0].url, this.files[0].output_path);

            var outputDir = this.options.output_directory

            var outputFileName: string
            if(output_file.path != null){
                outputFileName = output_file.path
            }else{
                outputFileName = outputDir + path.basename(output_file.url)
            }
            output_file.path = outputFileName

            try {
                await this.download(output_file.url, output_file.path).then(async (response: any) => {
                    output_file.retry_times += 1;
                    output_file.response = response
                    if(response.status == DownloaderTypes.Status.OK){
                        output_file.fileInfo = response.message
                        response.message = null
                        output_file.response = response
                        parent.files.splice(0, 1)[0]  //REMOVE FROM INPUT
                        parent.output_files.push(output_file);
                        Log.singleFileStats(output_file, parent.output_files, parent.total_files, parent.options.debug_mode)
                    }else if(response.status == DownloaderTypes.Status.KO && output_file.retry_times == parent.options.retry_times){
                        parent.files.splice(0, 1)[0]  //REMOVE FROM INPUT
                        parent.output_files.push(output_file);
                        Log.singleFileStats(output_file, parent.output_files, parent.total_files, parent.options.debug_mode)
                    }
                    await parent.checkAndDownload(callback)
                });
            } catch (error) {
                output_file.retry_times += 1;
                output_file.response = new DownloaderTypes.Response(DownloaderTypes.Status.KO, error)
                parent.files.splice(0, 1)[0]  //REMOVE FROM INPUT
                parent.output_files.push(output_file);
                Log.singleFileStats(output_file, parent.output_files, parent.total_files, parent.options.debug_mode)
                await parent.checkAndDownload(callback)
            }   
        }else{
            let errorCount = parent.output_files.filter(x=>x.response?.status == DownloaderTypes.Status.KO).length;
            let retryCount = parent.output_files.filter(x=>x.retry_times > 1).length;
            let dowloadedCount = parent.output_files.filter(x=>x.response?.status == DownloaderTypes.Status.OK).length;

            Log.write("Downloaded "+ dowloadedCount + 
                    " files, " + errorCount + 
                    " errors and " + retryCount + " retried", 
                    parent.options.debug_mode, DownloaderTypes.DebugMode.LOG)

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
                const request = proto.get(url, function(response: any) {
                    if (response.statusCode !== 200) {
                        reject(new DownloaderTypes.Response(DownloaderTypes.Status.KO, response.statusCode));
                        return;
                    }

                    const fileInfo: DownloaderTypes.FileInfo = {
                        mime: response.headers['content-type'],
                        size: parseInt(response.headers['content-length'], 10),
                    };
                    const file = fs.createWriteStream(filePath)
                    response.pipe(file);

                    // The destination stream is ended by the time it's called
                    file.on('finish', () => {
                        file.close()
                        resolve(new DownloaderTypes.Response(DownloaderTypes.Status.OK, fileInfo))
                    });

                    file.on('error', (err: any) => {
                        file.close()
                        fs.unlink(filePath, () => reject(new DownloaderTypes.Response(DownloaderTypes.Status.KO, err)));
                    });
                });

                request.on('error', (err: any) => {
                    fs.unlink(filePath, () => reject(new DownloaderTypes.Response(DownloaderTypes.Status.KO, err)));
                }); 
                request.end();

            } catch (error) {
                fs.unlink(filePath, () => reject(new DownloaderTypes.Response(DownloaderTypes.Status.KO, error)));
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

//export type OutputFile = typeof OutputFileClass
//declare module Downloader{}
export {
    DownloaderTypes
}