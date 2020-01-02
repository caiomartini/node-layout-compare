import { ImageCompareResult } from './../model/image-compare-result';
import BlinkDiff from 'blink-diff';
import DirectoryTree from 'directory-tree';
import fs from 'fs';

export class ImageCompareService {
    private baseImagesDirectory: string;
    private imagesDirectory: string;
    private resultDirectory: string;
    private extension: RegExp;

    constructor(baseImagesDirectory: string, imagesDirectory: string, resultDirectory: string, extension: RegExp) {
        this.baseImagesDirectory = baseImagesDirectory;
        this.imagesDirectory = imagesDirectory;
        this.resultDirectory = resultDirectory;
        this.extension = extension;
    }

    public compareDirectories(): Promise<ImageCompareResult[]> {
        return new Promise<ImageCompareResult[]>((resolve, reject) => {
            const promisesArray: Promise<ImageCompareResult>[] = [];
            const thresholdConfig = JSON.parse(fs.readFileSync(`${this.baseImagesDirectory}/threshold-config.json`, 'utf-8'));

            try {
                
                const imagesToCompare: any[] = [];

                DirectoryTree(this.imagesDirectory, { extensions: this.extension }, (fileToCompare) => {
                    imagesToCompare.push(fileToCompare);
                });                

                DirectoryTree(this.baseImagesDirectory, { extensions: this.extension }, (baseImage : any) => {
                    let threshold: number = thresholdConfig.threshold;
                    if (thresholdConfig.images) {
                        const imageThreshold = thresholdConfig.images.filter((image: any) => image.name === baseImage.name);
                        if (imageThreshold[0]) {                            
                            threshold = imageThreshold[0].threshold;
                        }
                    } 
                    promisesArray.push(this.compareFile(baseImage, imagesToCompare, threshold));
                });
                Promise.all(promisesArray).then((images) => {
                    resolve(images);
                });
            } 
            catch (error) {
                reject(error);
            };
        });
    }

    private compareFile(baseImage: any, imagesToCompare: any, threshold: number): Promise<ImageCompareResult> {
        return new Promise<ImageCompareResult>((resolve) => {
            let imageCompareResult = new ImageCompareResult();
            imageCompareResult.ImageName = baseImage.name;
            imageCompareResult.Threshold = threshold;
            
            const imageToCompare = imagesToCompare.filter((f: any) => 
                f.path.replace(this.imagesDirectory, '') === baseImage.path.replace(this.baseImagesDirectory, ''));

            if (imageToCompare[0]) {
                
                try {   
                    imageCompareResult.ImageResultPath = `result_${imageToCompare[0].name}`;                                       
 
                    const blinkDiff = new BlinkDiff({ 
                        imageAPath: baseImage.path,
                        imageBPath: imageToCompare[0].path,
                        imageOutputPath: `${this.resultDirectory}/${imageCompareResult.ImageResultPath}`,
                        threshold: threshold / 100,
                        thresholdType: BlinkDiff.THRESHOLD_PERCENT,
                    });                    
                    blinkDiff.run((error: any, result: any) => {
                        if (error) {
                            imageCompareResult.HasPassed = false;
                            imageCompareResult.Error = error;
                        } else {
                            imageCompareResult.ImageResultCode = result.code;
                            imageCompareResult.HasPassed = blinkDiff.hasPassed(result.code);
                            imageCompareResult.Differences = result.differences;                            
                        }
                        resolve(imageCompareResult);
                    });
                }
                catch (error) {                    
                    imageCompareResult.HasPassed = false;
                    imageCompareResult.Error = error;
                    resolve(imageCompareResult);
                }
            }
            else {
                imageCompareResult.HasPassed = false;
                imageCompareResult.Error = new Error("Imagem não encontrada");
                resolve(imageCompareResult);
            }
        });
    }
}