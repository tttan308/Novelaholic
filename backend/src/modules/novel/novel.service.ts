import { Injectable } from '@nestjs/common';
import { CrawlFactory } from '../crawl/crawl.factory';

@Injectable()
export class NovelService {
	constructor(private readonly CrawlFactory: CrawlFactory) {}

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

	getDetailsChapter(source: string, id: string, chapter: number) {
		const Crawl = this.CrawlFactory.getCrawl(source);
		if (Crawl) {
			const url = 'https://' + source;
			const details = Crawl.getDetailsChapter(url, id, chapter);
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

	async getGenres(source: string) {
		const Crawl = this.CrawlFactory.getCrawl(source);
		if (Crawl) {
			const url = 'https://' + source;
			const genres = await Crawl.getGenres(url);
			return genres;
		} else {
			throw new Error(`Crawl for source ${source} not found`);
		}
	}

	async getNovelsByGenre(source: string, genre: string, page: number) {
		const Crawl = this.CrawlFactory.getCrawl(source);
		if (Crawl) {
			const url = 'https://' + source;
			const novels = await Crawl.getNovelsByGenre(url, genre, page);
			return novels;
		} else {
			throw new Error(`Crawl for source ${source} not found`);
		}
	}
}
