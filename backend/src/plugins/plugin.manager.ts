import { Injectable, DynamicModule } from '@nestjs/common';
import { NovelPlugin } from './novel-plugin/novel-plugin.interface';
import * as fs from 'fs';
import * as path from 'path';
import { ExportFilePlugin } from './export-plugin/export-plugin.interface';

@Injectable()
export class PluginManager {
	public novelPlugins: { [key: string]: NovelPlugin } = {};
	public exportPlugins: { [key: string]: ExportFilePlugin } = {};

	async loadNovelPlugins(): Promise<DynamicModule[]> {
		const pluginsDirInSrc = path.join(
			__dirname,
			'../../src/plugins/novel-plugin',
		);
		const pluginsDir = path.join(__dirname, '../../dist/plugins/novel-plugin');

		const pluginsDirExistsInSrc = fs
			.readdirSync(pluginsDirInSrc)
			.filter(
				(file) => file.endsWith('.plugin.ts') || file.endsWith('.plugin.js'),
			)
			.map((file) => file.split('.')[0]);

		const pluginFiles = fs
			.readdirSync(pluginsDir)
			.filter(
				(file) => file.endsWith('.plugin.ts') || file.endsWith('.plugin.js'),
			)
			.filter((file) => pluginsDirExistsInSrc.includes(file.split('.')[0]));

		const dynamicModules: DynamicModule[] = [];
		for (const file of pluginFiles) {
			const pluginPath = path.join(pluginsDir, file);
			const modulePath = pluginPath
				.replace(/\\/g, '/')
				.replace('.ts', '')
				.replace('.js', '');

			const pluginModule = await import(modulePath);

			if (pluginModule && pluginModule.default) {
				const pluginInstance = new pluginModule.default();
				this.novelPlugins[pluginInstance.name.toLowerCase()] = pluginInstance;
				dynamicModules.push(pluginInstance.init());
			}
		}

		return dynamicModules;
	}

	async loadExportPlugins(): Promise<DynamicModule[]> {
		const pluginsDirInSrc = path.join(
			__dirname,
			'../../src/plugins/export-plugin',
		);

		const pluginsDir = path.join(__dirname, '../../dist/plugins/export-plugin');

		const pluginsDirExistsInSrc = fs
			.readdirSync(pluginsDirInSrc)
			.filter(
				(file) => file.endsWith('.plugin.ts') || file.endsWith('.plugin.js'),
			)
			.map((file) => file.split('.')[0]);

		const pluginFiles = fs
			.readdirSync(pluginsDir)
			.filter(
				(file) => file.endsWith('.plugin.ts') || file.endsWith('.plugin.js'),
			)
			.filter((file) => pluginsDirExistsInSrc.includes(file.split('.')[0]));

		const dynamicModules: DynamicModule[] = [];

		for (const file of pluginFiles) {
			const pluginPath = path.join(pluginsDir, file);
			const modulePath = pluginPath
				.replace(/\\/g, '/')
				.replace('.ts', '')
				.replace('.js', '');

			console.log(`Module path: ${modulePath}`);

			const pluginModule = await import(modulePath);

			console.log('Plugin module:', pluginModule);

			if (pluginModule && pluginModule.default) {
				const pluginInstance = new pluginModule.default();
				console.log('Plugin instance:', pluginInstance);
				this.exportPlugins[pluginInstance.type.toLowerCase()] = pluginInstance;
				dynamicModules.push(pluginInstance.init());
			}
		}

		console.log('Export plugins:', this.exportPlugins);

		return dynamicModules;
	}

	getNovelPlugins(): NovelPlugin[] {
		return Object.values(this.novelPlugins);
	}

	getExportPlugins(): ExportFilePlugin[] {
		return Object.values(this.exportPlugins);
	}
}
