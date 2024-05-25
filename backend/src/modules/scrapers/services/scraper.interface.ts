export interface IScraper {
	getDetails(url: string, name: string, page: number): Promise<any>;
	getDetailsChapter(url: string, name: string, page: number, chapterNumber: number): Promise<any>;
	getHotNovels(url: string): Promise<any>;
	searchNovels(url: string, keyword: string): Promise<any>;
}
