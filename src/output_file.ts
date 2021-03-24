
export class OutputFile{
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