import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configSwagger } from './configs/api-docs.config';
// import * as fs from 'fs';
// import * as path from 'path';

async function bootstrap() {
	const app = await NestFactory.create(await AppModule.forRoot());
	// const httpsOptions = {
	// 	key: fs.readFileSync(path.join(__dirname, '..', 'certs', 'key.pem')),
	// 	cert: fs.readFileSync(path.join(__dirname, '..', 'certs', 'cert.pem')),
	// };
	// const app = await NestFactory.create(await AppModule.forRoot(), {
	// 	httpsOptions,
	// });
	app.enableCors();

	// const pluginManager = app.get(PluginManager);
	// await pluginManager.loadPlugins();
	// pluginManager.watchPlugins();

	configSwagger(app);
	await app.listen(3001);
}
bootstrap();
