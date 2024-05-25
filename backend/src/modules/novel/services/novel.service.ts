import { Injectable } from '@nestjs/common';
import { ScraperFactoryService } from '../../scrapers/services/scraper-factory.service';

@Injectable()
export class NovelService {
	constructor(private readonly scraperFactory: ScraperFactoryService) {}

	async getDetails(source: string, name: string, page: number) {
		const scraper = this.scraperFactory.getScraper(source);
		if (scraper) {
			const url = 'https://' + source;
			const details = scraper.getDetails(url, name, page);
			return details;
		} else {
			throw new Error(`Scraper for source ${source} not found`);
		}
	}

	getDetailsChapter(
		source: string,
		name: string,
		page: number,
		chapterNumber: number,
	) {
		const scraper = this.scraperFactory.getScraper(source);
		if (scraper) {
			const url = 'https://' + source;
			const details = scraper.getDetailsChapter(url, name, page, chapterNumber);
			return details;
		} else {
			throw new Error(`Scraper for source ${source} not found`);
		}
	}

	async getHotNovels(source: string): Promise<any> {
		const scraper = this.scraperFactory.getScraper(source);
		console.log(scraper);
		if (scraper) {
			const url = 'https://' + source;
			console.log(url);
			const novels = await scraper.getHotNovels(url);
			return novels;
		} else {
			throw new Error(`Scraper for source ${source} not found`);
		}
	}

	async searchNovels(source: string, keyword: string) {
		const scraper = this.scraperFactory.getScraper(source);
		if (scraper) {
			const url = 'https://' + source;
			const novels = await scraper.searchNovels(url, keyword);
			return novels;
		} else {
			throw new Error(`Scraper for source ${source} not found`);
		}
	}
}
