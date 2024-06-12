import { Injectable } from '@nestjs/common';
import { PluginFactory } from './plugins/plugin.factory';
import { ExportFileDto } from './dtos/exportfile.dto';
@Injectable()
export class AppService {
	constructor(private readonly pluginFactory: PluginFactory) {}
	async getAllNovelPlugins() {
		return this.pluginFactory.getNovelPlugins();
	}

	async getAllExportPlugins() {
		return this.pluginFactory.getExportPlugins();
	}

	async export(exportFileDto: ExportFileDto) {
		return this.pluginFactory
			.getExportPlugin(exportFileDto.id)
			.export(exportFileDto);
	}
}
