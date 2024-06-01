import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configSwagger } from './configs/api-docs.config';

async function bootstrap() {
	const app = await NestFactory.create(await AppModule.forRoot());
	app.enableCors();

	// const pluginManager = app.get(PluginManager);
	// await pluginManager.loadPlugins();
	// pluginManager.watchPlugins();

	configSwagger(app);
	await app.listen(3001);
}
bootstrap();
