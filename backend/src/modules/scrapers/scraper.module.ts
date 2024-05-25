import { Module } from '@nestjs/common';
import { ScraperFactoryService } from './services/scraper-factory.service';
import { TruyenFullScraper } from './services/truyenfull-scraper.service';
import { TangThuVienScraper } from './services/tang-thu-vien-scraper.service';

@Module({
	providers: [ScraperFactoryService, TruyenFullScraper, TangThuVienScraper],
	exports: [ScraperFactoryService],
})
export class ScraperModule {}
