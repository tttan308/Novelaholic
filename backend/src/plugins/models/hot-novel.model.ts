export class HotNovel {
	id: string;
	cover: string;
	title: string;
	titleLink: string;
	isFull: boolean;
	isHot: boolean;
	author: string;
	chapter: string;
	chapterLink: string;

	constructor(
		id: string,
		cover: string,
		title: string,
		titleLink: string,
		isFull: boolean,
		isHot: boolean,
		author: string,
		chapter: string,
		chapterLink: string,
	) {
		this.id = id;
		this.cover = cover;
		this.title = title;
		this.titleLink = titleLink;
		this.isFull = isFull;
		this.isHot = isHot;
		this.author = author;
		this.chapter = chapter;
		this.chapterLink = chapterLink;
	}
}
