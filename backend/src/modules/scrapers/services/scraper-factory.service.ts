import { Injectable } from '@nestjs/common';
import { TruyenFullScraper } from './truyenfull-scraper.service';
import { TangThuVienScraper } from './tang-thu-vien-scraper.service';
import { IScraper } from './scraper.interface';

@Injectable()
export class ScraperFactoryService {
	private readonly scrapers: Map<string, IScraper>;

	constructor(
		truyenFullScraper: TruyenFullScraper,
		tangThuVienScraper: TangThuVienScraper,
	) {
		this.scrapers = new Map<string, IScraper>();
		this.scrapers.set('truyenfull.vn', truyenFullScraper);
		this.scrapers.set('tangthuvien.vn', tangThuVienScraper);
	}

	getScraper(source: string): IScraper | null {
		return this.scrapers.get(source) || null;
	}
}
