# LVR Bulk Downloader

## Easy downloading...

<br>

***Tested with 17000 files in input, about 17GB downloaded without an error.***

<br>

> ### Features
>
> - Single file or bulk download;
>
> - Retry download if failed;
>
> - Output directory flat or tree directories;
>
> - Sync or Async download;
>
> - Output response for all files downloaded;
<br>

<br>

## Installation

<br>

```bash
   npm i lvr_bulk_downloader --save
```

<br>

## Import

<br>

```typescript
   import { Downloader, DownloaderTypes } from 'lvr_bulk_downloader';
```

<br>

## Simple bulk downalod use

<br>

```typescript
    const files =  [ 
        new DownloaderTypes.InputFile('http://host.domain/dir/file.ext'), 
        new DownloaderTypes.InputFile('http://host.domain/dir/file2.ext')
        ];
    const downloader = new Downloader();
    downloader.run(files);
```

<br>

## Complex bulk download use

<br>

```typescript
    const files =  [ 
        new DownloaderTypes.InputFile('http://host.domain/dir/file.ext', './download/file.ext'), 
        new DownloaderTypes.InputFile('http://host.domain/dir/file2.ext', './download/dir/file2.ext'), 
        new DownloaderTypes.InputFile('http://host.domain/dir/file3.ext', './download/dir/file3.ext')
        ];
    
    const options = new DownloaderTypes.Options();
    options.output_directory = './download/';
    options.debug_mode = DownloaderTypes.DebugMode.DEBUG;
    options.retry_times = 3;

    const downloader = new Downloader(options);
    downloader.run(files, function(output: DownloaderTypes.OutputFile[]){
        const downloadedCount = output.filter(x=>x.response?.status == DownloaderTypes.Status.OK).length;
        const errorCount = output.filter(x=>x.response?.status == DownloaderTypes.Status.KO).length;
    });
```

<br>

## For sync download adding await to run function

<br>

```typescript
    const files =  [ 
        new DownloaderTypes.InputFile('http://host.domain/dir/file.ext'), 
        new DownloaderTypes.InputFile('http://host.domain/dir/file2.ext')
        ];
    const downloader = new Downloader();
    await downloader.run(files);
```

<br>

## Single file download use

<br>

```typescript
    var file = new DownloaderTypes.InputFile('http://host.domain/dir/file.ext');
    var downloader = new Downloader();
    downloader.run(file);
```

<br>
<br>
<br>

## Types definition
### Types are contained in module DownloaderTypes

<br>

### InputFile

> url: string
>
> output_path: string | null    //This attribute overwrite output_directory defined on options only for this file. 
>

<br>

### OutputFile

> url: string
>
> path: string | null
>
> retry_times: number
>
> response: Response | null
>

<br>

### Options

> retry_times: number = 3
>
> debug_mode: DebugMode = DebugMode.LOG
>
> output_directory: string = './download/'
>

<br>


### Response

> status: Status;
>
> message: any;
>

<br>

```typescript
enum Status{
    OK,
    KO
}
```


<br>

```typescript
enum DebugMode{
    NONE,
    DEBUG,
    LOG
}
```
