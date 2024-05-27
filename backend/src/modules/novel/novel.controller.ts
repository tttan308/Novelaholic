import { Controller, Get, Param, Query } from '@nestjs/common';
import { NovelService } from './novel.service';

@Controller('novels')
export class NovelController {
	constructor(private readonly novelService: NovelService) {}

	@Get()
	async getDetails(
		@Query('source') source: string = 'truyenfull.vn',
		@Query('name') name: string,
		@Query('page') page: number = 1,
	) {
		return this.novelService.getDetails(source, name, page);
	}

	@Get('hot')
	async getHotNovels(
		@Query('source') source: string = 'truyenfull.vn',
		@Query('page') page: number = 1,
	) {
		return this.novelService.getHotNovels(source, page);
	}

	@Get('search')
	async searchNovels(
		@Query('source') source: string = 'truyenfull.vn',
		@Query('keyword') keyword: string,
		@Query('page') page: number = 1,
	) {
		return this.novelService.searchNovels(source, keyword, page);
	}

	@Get('genres')
	async getGenres(@Query('source') source: string = 'truyenfull.vn') {
		return this.novelService.getGenres(source);
	}

	@Get('genres/:genre')
	async getNovelsByGenre(
		@Param('genre') genre: string,
		@Query('source') source: string = 'truyenfull.vn',
		@Query('page') page: number = 1,
	) {
		return this.novelService.getNovelsByGenre(source, genre, page);
	}

	@Get(':id/:chapter')
	getNovelChapter(
		@Param('id') id: string,
		@Param('chapter') chapter: number,
		@Query('source') source: string = 'truyenfull.vn',
	) {
		return this.novelService.getDetailsChapter(source, id, chapter);
	}
}
