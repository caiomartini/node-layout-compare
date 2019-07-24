import { ImageCompareService } from './service/image-compare.service';
import DirectoryTree from 'directory-tree';
import fs from 'fs';
import mustache from 'mustache';

console.log('Starting process ...');

const baseImagesDirectory = process.argv[2];
const imagesDirectory = process.argv[3];
const resultDirectory = process.argv[4];

if (!baseImagesDirectory) {
    console.log('* ERROR - The "Base Images Directory" argument not informed.');
    process.exit(1);
}   

if (!DirectoryTree(baseImagesDirectory)) {
    console.log(`* ERROR - The "Base Images Directory" [ ${baseImagesDirectory} ] not found.`);
    process.exit(1);
} 

if (!imagesDirectory) {
    console.log('* ERROR - The "Images Directory" argument not informed.');
    process.exit(1);
} 

if (!DirectoryTree(imagesDirectory)) {
    console.log(`* ERROR - The "Images Directory" [ ${imagesDirectory} ] not found.`);
    process.exit(1);
}

if (!resultDirectory) {
    console.log('* ERROR - The "Result Directory" argument not informed.');
    process.exit(1);
} 

if (!DirectoryTree(resultDirectory)) {
    console.log(`* ERROR - The "Result Directory" [ ${resultDirectory} ] not found.`);
    process.exit(1);
}

const imageCompareService = new ImageCompareService(baseImagesDirectory, imagesDirectory, resultDirectory, /\.png/);

imageCompareService.compareDirectories().then((imagesCompareResult) => {
    const totalPass = imagesCompareResult.filter((result) => result.HasPassed).length;
    const totalFail = imagesCompareResult.filter((result) => !result.HasPassed).length;    
    const resultJson = {
        "totalPass": totalPass,
        "totalFail": totalFail,
        "images": imagesCompareResult
    };
    const template = fs.readFileSync('template/template.html', 'utf-8');
    const result = mustache.render(template, resultJson);
    fs.writeFileSync(`${resultDirectory}/result.html`, result);
    if (totalFail > 0) {
        console.log('Process completed with error.');
        process.exit(1);
    }
    console.log('Process completed.');
}).catch((error) => {
    console.log(error);
    process.exit(1);
});
