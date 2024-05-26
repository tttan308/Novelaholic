import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configSwagger } from '@configs/api-docs.config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	configSwagger(app);
	app.enableCors();
	await app.listen(3001);
	if ((module as any).hot) {
		(module as any).hot.accept();
		(module as any).hot.dispose(() => app.close());
	}
}
bootstrap();
