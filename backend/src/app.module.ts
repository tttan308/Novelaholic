import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { NovelModule } from '@modules/novel/novel.module';
import { ScraperModule } from '@modules/scrapers/scraper.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			validationSchema: Joi.object({
				NODE_ENV: Joi.string()
					.valid('development', 'production', 'test', 'provision', 'staging')
					.default('development'),
				PORT: Joi.number().default(3000),
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
		ScraperModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
