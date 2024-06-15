import { Injectable } from '@nestjs/common';
import { DynamicModule } from '@nestjs/common';
import { ExportFilePlugin } from './export-plugin.interface';
import { ExportFileDto } from 'src/dtos/exportfile.dto';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import * as Mustache from 'mustache';
import { error } from 'console';
import { notEqual } from 'assert';

@Injectable()
export class PDFPlugin implements ExportFilePlugin {
	id = 1;
	type = 'pdf';

	init(): DynamicModule {
		return {
			module: PDFPlugin,
			providers: [
				{
					provide: 'ExportPlugin',
					useValue: PDFPlugin,
				},
			],
			exports: ['ExportPlugin'],
		};
	}

	async export(exportFileDto: ExportFileDto): Promise<Buffer> {
		// xử lý nội dung content 
		const refactordata = exportFileDto;
		refactordata.chapters.map((item,index)=> {
			item.chapterContent.replace('\<p>\g','\n')
								.replace('\<\p>\g','');
		})
		const htmlContent = this.generateHtml(refactordata);
		const pdfBuffer = await this.generatePdfFromHtml(htmlContent, exportFileDto.novelTitle);
		return pdfBuffer;
	}

	private generateHtml(exportFileDto: ExportFileDto): string {
		const templatePath = path.join(
			__dirname,
			'../../../src/',
			'template',
			'template.html',
		);
		const template = fs.readFileSync(templatePath, 'utf8');
		// const html = Mustache.render(template, exportFileDto);
		const html = Mustache.render(template,exportFileDto);
		

		return html;
	}

	private async generatePdfFromHtml(html: string, novelTitle: string): Promise<Buffer> {
		try{
			const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox']});
			const page = await browser.newPage();
			await page.setContent(html, {waitUntil: 'load', timeout: 0});
			const pdfBuffer = await page.pdf({ 
				format: 'A4' ,  
				printBackground: true, 
				displayHeaderFooter: true, 
				headerTemplate: `<div style="font-size: 10px; text-align: center; padding: 10px; width: 100%"></div>`,
				footerTemplate: `<div style="font-size: 10px; text-align: center; padding: 10px; width: 100%; color: gray ">${new Date().getUTCDate()}/${new Date().getUTCMonth() + 1}/${new Date().getFullYear()} - ${novelTitle} </div>`, 
				timeout: 0 });
			await browser.close();
			return pdfBuffer;
		}catch(error){
			console.log("Lỗi PDF: ", error);
			throw error;
		}
	}
}

export default PDFPlugin;
