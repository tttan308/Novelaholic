import { Injectable } from '@nestjs/common';
import { PluginFactory } from '../plugins/plugin.factory';

@Injectable()
export class NovelService {
	constructor(private readonly pluginFactory: PluginFactory) {}

	async getDetails(source: number, name: string, page: number): Promise<any> {
		return this.pluginFactory.getNovelPlugin(source).getDetails(name, page);
	}

	async getDetailsChapter(
		source: number,
		id: string,
		chapter: number,
	): Promise<any> {
		return this.pluginFactory
			.getNovelPlugin(source)
			.getDetailsChapter(id, chapter);
	}

	async getHotNovels(source: number, page: number): Promise<any> {
		return this.pluginFactory.getNovelPlugin(source).getHotNovels(page);
	}

	async searchNovels(
		source: number,
		keyword: string,
		page: number,
	): Promise<any> {
		return this.pluginFactory
			.getNovelPlugin(source)
			.searchNovels(keyword, page);
	}

	async getGenres(source: number): Promise<any> {
		return this.pluginFactory.getNovelPlugin(source).getGenres();
	}

	async getNovelsByGenre(
		source: number,
		genre: string,
		page: number,
	): Promise<any> {
		return this.pluginFactory
			.getNovelPlugin(source)
			.getNovelsByGenre(genre, page);
	}
}
