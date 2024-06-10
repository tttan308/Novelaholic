import { Inject, Injectable } from '@nestjs/common';
import { Plugin } from './plugin.interface';

@Injectable()
export class PluginFactory {
	private plugins: { [key: number]: Plugin } = {};

	constructor(@Inject('PLUGINS') private readonly loadedPlugins: Plugin[]) {
		loadedPlugins.forEach((plugin) => {
			this.plugins[plugin.id] = plugin;
		});
	}

	getPlugin(source: number): Plugin {
		const plugin = this.plugins[source];

		if (!plugin) {
			throw new Error(`Source plugin not found: ${source}`);
		}
		return plugin;
	}

	getPlugins(): { id: number; name: string; url: string }[] {
		return this.loadedPlugins.map((plugin) => {
			return {
				id: plugin.id || 0,
				name: plugin.name,
				url: plugin.url,
			};
		});
	}
}
