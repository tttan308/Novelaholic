import { DynamicModule } from '@nestjs/common';

export interface ICrawl {
	getDetails(name: string, page: number): Promise<any>;
	getDetailsChapter(id: string, chapter: number): Promise<any>;
	getHotNovels(page: number): Promise<any>;
	searchNovels(keyword: string, page: number): Promise<any>;
	getGenres(): Promise<any>;
	getNovelsByGenre(genre: string, page: number): Promise<any>;
}

export interface Plugin {
	id: number;
	name: string;
	init(): DynamicModule;
}
