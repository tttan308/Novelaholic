import { DynamicModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { NovelModule } from './novel/novel.module';
import { PluginManager } from './plugins/plugin.manager';
import { PluginFactory } from './plugins/plugin.factory';
import { PluginModule } from './plugins/plugin.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			validationSchema: Joi.object({
				NODE_ENV: Joi.string()
					.valid('development', 'production', 'test', 'provision', 'staging')
					.default('development'),
				PORT: Joi.number().default(3001),
			}),
			validationOptions: {
				abortEarly: false,
			},
			isGlobal: true,
			envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
			cache: true,
			expandVariables: true,
		}),
		NovelModule,
	],
	controllers: [AppController],
	providers: [AppService, PluginManager, PluginFactory],
})
export class AppModule {
	static async forRoot(): Promise<DynamicModule> {
		const pluginModule = await PluginModule.forRoot();

		return {
			module: AppModule,
			imports: [pluginModule, NovelModule],
		};
	}
}
