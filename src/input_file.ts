export class InputFile{
    url: string
    path: string | null
    constructor(u: string, p: string | null = null){
        this.url = u
        this.path = p
    }
}