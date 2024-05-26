import { Injectable } from '@nestjs/common';
import { TruyenFullCrawl } from './truyenfull/truyenfull.service';
import { TangThuVienCrawl } from './tangthuvien/tangthuvien.service';
import { ICrawl } from './crawl.interface';

@Injectable()
export class CrawlFactoryService {
	private readonly Crawls: Map<string, ICrawl>;

	constructor(
		truyenFullCrawl: TruyenFullCrawl,
		tangThuVienCrawl: TangThuVienCrawl,
	) {
		this.Crawls = new Map<string, ICrawl>();
		this.Crawls.set('truyenfull.vn', truyenFullCrawl);
		this.Crawls.set('tangthuvien.vn', tangThuVienCrawl);
	}

	getCrawl(source: string): ICrawl | null {
		return this.Crawls.get(source) || null;
	}
}
