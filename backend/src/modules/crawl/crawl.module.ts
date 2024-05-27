import { Module } from '@nestjs/common';
import { CrawlFactory } from './crawl.factory';
import { TruyenFullCrawl } from './truyenfull/truyenfull.service';
import { TangThuVienCrawl } from './tangthuvien/tangthuvien.service';

@Module({
	providers: [CrawlFactory, TruyenFullCrawl, TangThuVienCrawl],
	exports: [CrawlFactory],
})
export class CrawlModule {}
