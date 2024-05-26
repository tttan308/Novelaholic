export interface ICrawl {
	getDetails(url: string, name: string, page: number): Promise<any>;
	getDetailsChapter(
		url: string,
		name: string,
		page: number,
		chapterNumber: number,
	): Promise<any>;
	getHotNovels(url: string, page: number): Promise<any>;
	searchNovels(url: string, keyword: string, page: number): Promise<any>;
}
