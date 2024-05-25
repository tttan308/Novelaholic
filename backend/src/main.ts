import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configSwagger } from '@configs/api-docs.config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	configSwagger(app);
	await app.listen(3000);
}
bootstrap();
