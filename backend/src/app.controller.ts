import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ExportFileDto } from './dtos/exportfile.dto';
import { ApiOperation } from '@nestjs/swagger';

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
	@ApiOperation({ summary: 'Create a new novel' })
	async export(@Body() exportFileDto: ExportFileDto) {
		return this.appService.export(exportFileDto);
	}
}
