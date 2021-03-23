# LVR Bulk Downloader

## Download it's very easy

<br>

***Tested with 17000 files in input, totaling about 17GB without an error***

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
> - Output response for all files;
> <br>
<br>

<br>

## Simple use

<br>

```typescript
    const files =  [ 
        new File('http://host.domain/dir/file.ext'), 
        new File('http://host.domain/dir/file2.ext')
        ];
    const downloader = new Downloader();
    downloader.run(files);
```

<br>

## Complex use

<br>

```typescript
    const files =  [ 
        new File('http://host.domain/dir/file.ext', './download/file.ext'), 
        new File('http://host.domain/dir/file2.ext', './download/dir/file2.ext'), 
        new File('http://host.domain/dir/file3.ext', './download/dir/file3.ext')
        ];
    
    const options = new Options();
    options.output_directory = './download/';
    options.debug_mode = DebugMode.DEBUG;
    options.retry_times = 3;

    const downloader = new Downloader(options);
    downloader.run(files);
```

<br>

## Single download use

<br>

```typescript
    var file = new File('http://host.domain/dir/file.ext');
    var downloader = new Downloader();
    downloader.run(file);
```

<br>
