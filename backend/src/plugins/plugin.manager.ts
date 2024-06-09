import { Injectable, DynamicModule } from '@nestjs/common';
import { Plugin } from './plugin.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PluginManager {
	public plugins: { [key: string]: Plugin } = {};

	async loadPlugins(): Promise<DynamicModule[]> {
		const pluginsDir = path.join(__dirname, '../../dist/plugins');

		const pluginFiles = fs
			.readdirSync(pluginsDir)
			.filter(
				(file) => file.endsWith('.plugin.ts') || file.endsWith('.plugin.js'),
			);

		const dynamicModules: DynamicModule[] = [];
		for (const file of pluginFiles) {
			console.log(`Loading plugin: ${file}`);
			const pluginPath = path.join(pluginsDir, file);
			const modulePath = pluginPath
				.replace(/\\/g, '/')
				.replace('.ts', '')
				.replace('.js', '');

			console.log(`Module path: ${modulePath}`);

			const pluginModule = await import(modulePath);

			if (pluginModule && pluginModule.default) {
				const pluginInstance = new pluginModule.default();
				this.plugins[pluginInstance.name.toLowerCase()] = pluginInstance;
				dynamicModules.push(pluginInstance.init());
			}
			console.log(`Plugin loaded: ${file}`);
		}

		return dynamicModules;
	}

	getPlugins(): Plugin[] {
		return Object.values(this.plugins);
	}

	// watchPlugins(): void {
	// 	const pluginsDir = path.join(__dirname, '../../src/plugins');
	// 	console.log(`Watching plugins directory: ${pluginsDir}`);
	// 	const watcher = chokidar.watch(pluginsDir, {
	// 		ignored: /(^|[\/\\])\../,
	// 		persistent: true,
	// 	});

	// 	watcher
	// 		.on('add', (filePath) => {
	// 			console.log(`File added: ${filePath}`);
	// 			this.handleFileChange(filePath);
	// 		})
	// 		.on('change', (filePath) => {
	// 			console.log(`File changed: ${filePath}`);
	// 			this.handleFileChange(filePath);
	// 		})
	// 		.on('unlink', (filePath) => {
	// 			console.log(`File removed: ${filePath}`);
	// 			this.handleFileChange(filePath);
	// 		});
	// }

	// private async handleFileChange(filePath: string) {
	// 	console.log(
	// 		`File ${filePath} has been added/changed/removed. Reloading plugins...`,
	// 	);
	// 	await this.loadPlugins();
	// }
}
