import { Controller, Get, Query } from '@nestjs/common';
import { NovelService } from '../services/novel.service';

@Controller('novels')
export class NovelController {
	constructor(private readonly novelService: NovelService) {}

	@Get()
	async getDetails(
		@Query('source') source: string = 'truyenfull.vn',
		@Query('name') name: string,
		@Query('page') page: number = 1,
	) {
		const chapterInfo = name.split('/').pop();
		if (chapterInfo && chapterInfo.startsWith('chapter')) {
			const chapterNumber = Number(chapterInfo.split('chapter').pop());
			return this.novelService.getDetailsChapter(
				source,
				name,
				page,
				chapterNumber,
			);
		}
		return this.novelService.getDetails(source, name, page);
	}

	@Get('hot')
	async getHotNovels(@Query('source') source: string = 'truyenfull.vn') {
		return this.novelService.getHotNovels(source);
	}

	@Get('search')
	async searchNovels(
		@Query('source') source: string = 'truyenfull.vn',
		@Query('keyword') keyword: string,
	) {
		return this.novelService.searchNovels(source, keyword);
	}
}
