import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from './configs/configuration.config';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create(AppModule);
  // await app.listen(3000);
  const config_service = app.get(ConfigService);
  logger.debug(config_service.get('NODE_ENV'));
  logger.debug(config_service.get('PORT'));

  const database_env = config_service.get<DatabaseConfig>('database');
  logger.debug(database_env);

  logger.debug('type of PORT:', typeof config_service.get('PORT'));

  await app.listen(config_service.get('PORT'), () =>
    logger.log(
      `Server is running on http://localhost:${config_service.get('PORT')}`,
    ),
  );
}
bootstrap();
