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