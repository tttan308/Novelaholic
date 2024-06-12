import { Module, DynamicModule, Global } from '@nestjs/common';
import { PluginManager } from './plugin.manager';
import { PluginFactory } from './plugin.factory';
import { AppService } from '../app.service';

@Global()
@Module({
	providers: [AppService],
})
export class PluginModule {
	static async forRoot(): Promise<DynamicModule> {
		const pluginManager = new PluginManager();
		const dynamicNovelModules = await pluginManager.loadNovelPlugins();
		const dynamicExportModules = await pluginManager.loadExportPlugins();

		return {
			module: PluginModule,
			imports: [...dynamicNovelModules, ...dynamicExportModules],
			providers: [
				PluginManager,
				PluginFactory,
				{
					provide: 'PLUGINS',
					useFactory: () => pluginManager.getNovelPlugins(),
				},
				{
					provide: 'EXPORT_PLUGINS',
					useFactory: () => pluginManager.getExportPlugins(),
				},
			],
			exports: [PluginFactory, PluginManager, 'PLUGINS', 'EXPORT_PLUGINS'],
		};
	}
}
