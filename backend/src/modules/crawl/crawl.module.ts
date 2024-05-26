import { Module } from '@nestjs/common';
import { CrawlFactoryService } from './crawl-factory.service';
import { TruyenFullCrawl } from './truyenfull/truyenfull.service';
import { TangThuVienCrawl } from './tangthuvien/tangthuvien.service';

@Module({
	providers: [CrawlFactoryService, TruyenFullCrawl, TangThuVienCrawl],
	exports: [CrawlFactoryService],
})
export class CrawlModule {}
