export interface ICrawl {
	getDetails(url: string, name: string, page: number): Promise<any>;
	getDetailsChapter(url: string, id: string, chapter: number): Promise<any>;
	getHotNovels(url: string, page: number): Promise<any>;
	searchNovels(url: string, keyword: string, page: number): Promise<any>;
	getGenres(url: string): Promise<any>;
	getNovelsByGenre(url: string, genre: string, page: number): Promise<any>;
}
