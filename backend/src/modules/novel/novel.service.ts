import { Injectable } from '@nestjs/common';
import { CrawlFactoryService } from '../crawl/crawl-factory.service';

@Injectable()
export class NovelService {
	constructor(private readonly CrawlFactory: CrawlFactoryService) {}

	async getDetails(source: string, name: string, page: number) {
		const Crawl = this.CrawlFactory.getCrawl(source);
		if (Crawl) {
			const url = 'https://' + source;
			const details = Crawl.getDetails(url, name, page);
			return details;
		} else {
			throw new Error(`Crawl for source ${source} not found`);
		}
	}

	getDetailsChapter(
		source: string,
		name: string,
		page: number,
		chapterNumber: number,
	) {
		const Crawl = this.CrawlFactory.getCrawl(source);
		if (Crawl) {
			const url = 'https://' + source;
			const details = Crawl.getDetailsChapter(url, name, page, chapterNumber);
			return details;
		} else {
			throw new Error(`Crawl for source ${source} not found`);
		}
	}

	async getHotNovels(source: string, page: number): Promise<any> {
		const Crawl = this.CrawlFactory.getCrawl(source);
		if (Crawl) {
			const url = 'https://' + source;
			const novels = await Crawl.getHotNovels(url, page);
			return novels;
		} else {
			throw new Error(`Crawl for source ${source} not found`);
		}
	}

	async searchNovels(source: string, keyword: string, page: number) {
		const Crawl = this.CrawlFactory.getCrawl(source);
		if (Crawl) {
			const url = 'https://' + source;
			const novels = await Crawl.searchNovels(url, keyword, page);
			return novels;
		} else {
			throw new Error(`Crawl for source ${source} not found`);
		}
	}
}
