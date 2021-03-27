export class InputFile{
    url: string
    output_path: string | null
    constructor(u: string, p: string | null = null){
        this.url = u
        this.output_path = p
    }
}