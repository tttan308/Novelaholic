import { Novel } from './novel.model';

export class NovelList {
	novels: Novel[];
	totalPages: number;
	currentPage: number;

	constructor(novels: Novel[], totalPages: number, currentPage: number) {
		this.novels = novels;
		this.totalPages = totalPages;
		this.currentPage = currentPage;
	}
}
