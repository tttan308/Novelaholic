import { Inject, Injectable } from '@nestjs/common';
import { NovelPlugin } from './novel-plugin/novel-plugin.interface';
import { ExportFilePlugin } from './export-plugin/export-plugin.interface';

@Injectable()
export class PluginFactory {
	private novelPlugins: { [key: number]: NovelPlugin } = {};
	private exportPlugins: { [key: number]: ExportFilePlugin } = {};

	constructor(
		@Inject('PLUGINS') private readonly loadedPlugins: NovelPlugin[],
		@Inject('PLUGINS') private readonly loadedExportPlugins: ExportFilePlugin[],
	) {
		loadedPlugins.forEach((plugin) => {
			this.novelPlugins[plugin.id] = plugin;
		});

		loadedExportPlugins.forEach((plugin) => {
			this.exportPlugins[plugin.id] = plugin;
		});
	}

	getNovelPlugin(source: number): NovelPlugin {
		const plugin = this.novelPlugins[source];

		if (!plugin) {
			throw new Error(`Source plugin not found: ${source}`);
		}
		return plugin;
	}

	getExportPlugins(): { id: number; type: string }[] {
		return this.loadedExportPlugins
			.filter((plugin) => plugin.type.includes('Export'))
			.map((plugin) => {
				return {
					id: plugin.id || 0,
					type: plugin.type,
				};
			});
	}

	getNovelPlugins(): { id: number; name: string; url: string }[] {
		return this.loadedPlugins.map((plugin) => {
			return {
				id: plugin.id || 0,
				name: plugin.name,
				url: plugin.url,
			};
		});
	}

	getExportPlugin(id: number): ExportFilePlugin {
		const plugin = this.exportPlugins[id];

		if (!plugin) {
			throw new Error(`Export plugin not found: ${id}`);
		}
		return plugin;
	}
}
