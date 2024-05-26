import { Chapter } from './chapter.interface';
import { Genre } from './genre.interface';

export interface Details {
	title: string;
	cover: string;
	author: string;
	genres: Genre[];
	source: string;
	status: string;
	description: string;
	chapters: Chapter[];
	maxPage: number;
}
