import { Inject, Injectable } from '@nestjs/common';
import { ICrawl, Plugin } from './plugin.interface';

@Injectable()
export class PluginFactory {
	private plugins: { [key: string]: Plugin } = {};

	constructor(@Inject('PLUGINS') private readonly loadedPlugins: Plugin[]) {
		loadedPlugins.forEach((plugin) => {
			this.plugins[plugin.constructor.name.toLowerCase()] = plugin;
		});
	}

	getPlugin(source: string): Plugin {
		const realSource = source.toLowerCase() + 'plugin';
		const plugin = this.plugins[realSource];
		if (!plugin) {
			throw new Error(`Source plugin not found: ${source}`);
		}

		return plugin;
	}

	getPlugins(): { id: number; name: string }[] {
		return this.loadedPlugins.map((plugin) => {
			return {
				id: plugin.id || 0,
				name: plugin.constructor.name.toLowerCase(),
			};
		});
	}
}
