export class ImageCompareResult {
    private _imageName: string = '';
    public get ImageName(): string {
        return this._imageName;
    }
    public set ImageName(value: string) {
        this._imageName = value;
    }

    private _hasPassed: boolean = false;
    public get HasPassed(): boolean {
        return this._hasPassed;
    }
    public set HasPassed(value: boolean) {
        this._hasPassed = value;
    }

    private _differences: number = 0;
    public get Differences(): number {
        return this._differences;
    }
    public set Differences(value: number) {
        this._differences = value;
    }
    
    private _imageResultPath: string = '';
    public get ImageResultPath(): string {
        return this._imageResultPath;
    }
    public set ImageResultPath(value: string) {
        this._imageResultPath = value;
    }

    private _error: any;
    public get Error(): any {
        return this._error;
    }
    public set Error(value: any) {
        this._error = value;
    }
    
    private _threshold: number;
    public get Threshold(): number {
        return this._threshold;
    }
    public set Threshold(value: number) {
        this._threshold = value;
    }

    private _thresholdType: string;
    public get ThresholdType(): string {
        return this._thresholdType;
    }
    public set ThresholdType(value: string) {
        this._thresholdType = value;
    }    

    private _imageResultCode: number;
    public set ImageResultCode(value: number) {
        this._imageResultCode = value;
    }

    public get ImageResultText(): string {
        if (this._imageResultCode === 1) {
            return "The images are too different";
        }
        if (this._imageResultCode === 5) {
            return "The images are identical";
        }
        if (this._imageResultCode === 7) {
            return "The images are very similar, but still below the threshold";
        }
        return "";
    }
}