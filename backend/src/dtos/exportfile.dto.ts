export class Chapter{
	chapterContent: string;
	chapterTitle: string;
}


export class ExportFileDto {
	id: number;
	author: string;
	chapters: Chapter[];
	novelTitle: string;
}
