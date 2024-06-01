import { Injectable } from '@nestjs/common';
import { PluginFactory } from './plugins/plugin.factory';
@Injectable()
export class AppService {
	constructor(private readonly pluginFactory: PluginFactory) {}
	async getAllPlugins() {
		return this.pluginFactory.getPlugins();
	}
}
