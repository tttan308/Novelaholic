import { Module } from '@nestjs/common';
import { NovelService } from './services/novel.service';
import { NovelController } from './controllers/novel.controller';
import { ScraperModule } from '../scrapers/scraper.module';

@Module({
	imports: [ScraperModule],
	providers: [NovelService],
	controllers: [NovelController],
})
export class NovelModule {}
