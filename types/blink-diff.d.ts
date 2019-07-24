export = index;
declare class index {
    static OUTPUT_ALL: number;
    static OUTPUT_DIFFERENT: number;
    static OUTPUT_SIMILAR: number;
    static RESULT_DIFFERENT: number;
    static RESULT_IDENTICAL: number;
    static RESULT_SIMILAR: number;
    static RESULT_UNKNOWN: number;
    static THRESHOLD_PERCENT: string;
    static THRESHOLD_PIXEL: string;
    static version: string;
    constructor(options: any);
    hasPassed(result: any): any;
    isAboveThreshold(items: any, total: any): any;
    log(text: any): void;
    run(fn: any): void;
    runSync(): any;
    runWithPromise(): any;
}
