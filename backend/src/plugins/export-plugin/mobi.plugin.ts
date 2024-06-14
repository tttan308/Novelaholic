// import { Injectable } from '@nestjs/common';
// import { DynamicModule } from '@nestjs/common';
// import { ExportFilePlugin } from './export-plugin.interface';
// import { ExportFileDto } from 'src/dtos/exportfile.dto';
// const JSZip = require('jszip');
// import * as AdmZip from 'adm-zip'
// import { file } from 'pdfkit';
// import { exec } from 'child_process';
// import { error } from 'console';
// import { cwd } from 'process';
// import * as fs from 'fs';
// import { tmpdir } from 'os';

// async function createTempFile(content: string): Promise<string> {
//     const fileName = `${Math.random().toString(36).substr(2, 9)}.txt`; // Generate unique filename
//     const filePath = `${tempDir}/${fileName}`;

//     await fs.promises.writeFile(filePath, content);
//     return filePath;
// }

// async function readFileSync(filePath: string): Promise<string> {
//     return await fs.promises.readFile(filePath, 'utf8');
// }

// async function deleteFile(filePath: string): Promise<void> {
//     await fs.promises.unlink(filePath);
// }

// const tempDir: string = tmpdir(); 
// @Injectable()
// export class MOBIPlugin implements ExportFilePlugin {
// 	id = 3;
// 	type = 'mobi';

// 	init(): DynamicModule {
// 		return {
// 			module: MOBIPlugin,
// 			providers: [
// 				{
// 					provide: 'ExportPlugin',
// 					useValue: MOBIPlugin,
// 				},
// 			],
// 			exports: ['ExportPlugin'],
// 		};
// 	}
    

// 	async export(exportFileDto: ExportFileDto): Promise<Buffer> {
// 		const { novelTitle, author, chapterTitle, chapterContent } = exportFileDto;

//        try{
//             // const tempFilePath = createTempFile(chapterContent);

//             // //generate mobi file 
//             // const mobiFilePath = "output.mobi";
//             // await exec(`ebook-convert ${tempFilePath} ${mobiFilePath}`,{cwd: tempDir});

//             // // combine MOBI file into new ZIP Archive 
//             // const newZip = new AdmZip();
//             // newZip.addFile(await readFileSync(mobiFilePath),Buffer.from('output.mobi'));

//             // //generate new buffer from modified ZIP archive 
//             // const newZipBuffer = newZip.toBuffer();
//             // deleteFile(await tempFilePath);
//             // deleteFile(mobiFilePath);
//             // return newZipBuffer;
//             const zip = new JSZip();
        
//             zip.file('hello.txt','hello world!!');
//             const buffer = await zip.generateAsync({ type: 'nodebuffer' });
//             return buffer;
//         } catch (error) {
// 			console.log(error);
// 			throw new Error('Error generating MOBI file');
// 		}


// 	}

//     private prepareStringForEbook(contentString: String) : String{
//         // Check if HTML, use it directly
//             if (this.isHTML(contentString)) {
//                 return contentString;
//             } else {
//                 // Format plain text (add paragraphs, line breaks, etc.)
//                 const formattedText = contentString.replace(/\n/g, "\n\n"); // Replace newlines with double newlines for paragraphs
//                 return formattedText;
//             }
//     }

        

//     private isHTML(contentString: String): boolean{
//         return contentString.startsWith("<html");
//     }
//     private isTextFile(fileName: String): boolean {
//         return fileName.endsWith(".txt") || fileName.endsWith(".html");
//     }
// 	private generateUUID(): string {
// 		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
// 			/[xy]/g,
// 			function (c) {
// 				const r = (Math.random() * 16) | 0,
// 					v = c == 'x' ? r : (r & 0x3) | 0x8;
// 				return v.toString(16);
// 			},
// 		);
// 	}
// }

// export default MOBIPlugin;
