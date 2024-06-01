import { Genre } from './genre.model';
import { Chapter } from './chapter.model';

export class Details {
	title: string;
	cover: string;
	author: string;
	genres: Genre[];
	source: string;
	status: string;
	description: string;
	chapters: Chapter[];
	maxPage: number;

	constructor() {
		this.title = '';
		this.cover = '';
		this.author = '';
		this.genres = [];
		this.source = '';
		this.status = '';
		this.description = '';
		this.chapters = [];
		this.maxPage = 1;
	}
}
