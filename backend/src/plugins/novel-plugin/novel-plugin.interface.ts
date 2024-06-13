import { DynamicModule } from '@nestjs/common';

export interface NovelPlugin {
	id: number;
	name: string;
	url: string;
	init(): DynamicModule;
	getDetails(name: string, page: number): Promise<any>;
	getDetailsChapter(id: string, chapter: number): Promise<any>;
	getHotNovels(page: number): Promise<any>;
	searchNovels(keyword: string, page: number): Promise<any>;
	getGenres(): Promise<any>;
	getNovelsByGenre(genre: string, page: number): Promise<any>;
	getIdByTitleAndAuthor(title: string, author: string): Promise<string>;
}
