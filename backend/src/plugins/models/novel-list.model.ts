import { HotNovel } from './hot-novel.model';

export class NovelList {
	novels: HotNovel[];
	totalPages: number;
	currentPage: number;

	constructor(novels: HotNovel[], totalPages: number, currentPage: number) {
		this.novels = novels;
		this.totalPages = totalPages;
		this.currentPage = currentPage;
	}
}
