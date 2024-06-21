import { Body, Controller, Get, Post, Res, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ExportFileDto } from './dtos/exportfile.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { file } from 'pdfkit';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get('sources')
	async getNovelSources() {
		return this.appService.getAllNovelPlugins();
	}

	@Get('export')
	async exportSources() {
		return this.appService.getAllExportPlugins();
	}

	@Post('export')
	@ApiOperation({ summary: 'Save novel into a file' })
	@ApiBody({
		description: 'Data needed to generate the PDF',
		schema: {
			example: {
				
					id :2,
					author : "author name",
					novelTitle : "Novel title name",
					chapters: [{
						chapterTitle: "chapter title 1",
						chapterContent: "Chapter content 1"
						},
						{
						chapterTitle: "chapter title 2",
						chapterContent: "Chapter content 2"
						}, 
						{
						chapterTitle: "chapter title 3",
						chapterContent: "Chapter content 3"
						}
					 ]
			},
		},
	})
	async export(@Body() exportFileDto: ExportFileDto, @Res() res: Response) {
		try {
			const buffer = await this.appService.export(exportFileDto);
			const type = await this.appService.getExportType(exportFileDto.id);
			res.setHeader('Content-Type', type);
			var name = exportFileDto.novelTitle.normalize('NFD').replace(/[\u0300-\u036F]/g, '').replace(/đ/g, 'd').replace(/Đ/g,'D');
			var i = 0;
			while((name[i] >= 'a' && name[i] <= 'z') || (name[i] >= 'A' && name[i] <= 'Z') || (name[i] >= '0' && name[i] <= '9') || name[i] == ' ' )
				++i;
			name = name.substring(0,i);
			const filename = `${name}.${type}`;
			res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

			res.send(buffer);
		} catch (error) {
			res
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.send('Error generating file');
		}
	}
}
