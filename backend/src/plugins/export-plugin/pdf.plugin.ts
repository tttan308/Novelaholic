import { Injectable } from '@nestjs/common';
import { DynamicModule } from '@nestjs/common';
import { ExportFilePlugin } from './export-plugin.interface';
import { ExportFileDto } from 'src/dtos/exportfile.dto';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import * as Mustache from 'mustache';

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
		const htmlContent = this.generateHtml(exportFileDto);
		const pdfBuffer = await this.generatePdfFromHtml(htmlContent);
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
		const html = Mustache.render(template, exportFileDto);
		return html;
	}

	private async generatePdfFromHtml(html: string): Promise<Buffer> {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.setContent(html);
		const pdfBuffer = await page.pdf({ format: 'A4' });
		await browser.close();
		return pdfBuffer;
	}
}

export default PDFPlugin;
