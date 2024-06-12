import { Body, Controller, Get, Post, Res, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ExportFileDto } from './dtos/exportfile.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';

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
				id: 1,
				author: 'John Doe',
				chapterContent: 'This is the content of the chapter...',
				chapterTitle: 'Chapter One',
				novelTitle: 'The Great Novel',
			},
		},
	})
	async export(@Body() exportFileDto: ExportFileDto, @Res() res: Response) {
		try {
			const buffer = await this.appService.export(exportFileDto);
			const type = await this.appService.getExportType(exportFileDto.id);
			res.setHeader('Content-Type', type);

			const filename = `${exportFileDto.novelTitle}.${type}`;
			res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

			res.send(buffer);
		} catch (error) {
			res
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.send('Error generating file');
		}
	}

	@Get('test')
	async test() {
		return '<h1>Test</h1>';
	}
}
