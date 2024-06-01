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
		const dynamicModules = await pluginManager.loadPlugins();

		return {
			module: PluginModule,
			imports: [...dynamicModules],
			providers: [
				PluginManager,
				PluginFactory,
				{
					provide: 'PLUGINS',
					useFactory: () => pluginManager.getPlugins(),
				},
			],
			exports: [PluginFactory, PluginManager, 'PLUGINS'],
		};
	}
}
