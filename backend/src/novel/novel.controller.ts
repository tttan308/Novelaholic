import { Controller, Get, Param, Query } from '@nestjs/common';
import { NovelService } from './novel.service';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('novels')
@ApiTags('novels')
export class NovelController {
	constructor(private readonly novelService: NovelService) {}

	@Get()
	@ApiOperation({
		summary: 'Get novels with name',
		description: `
			* The "page" parameter is optional, defaulting to 1. This indicates that this is the first page of the novel chapters.
		`,
	})
	@ApiQuery({
		name: 'source',
		required: false,
		description: 'Source of the novel',
		example: 'truyenfull',
	})
	@ApiQuery({
		name: 'name',
		required: true,
		description: 'ID of the novel',
		example: 'tu-cam-270192',
	})
	@ApiQuery({
		name: 'page',
		required: false,
		description: 'Page of the novel chapters',
		example: 1,
	})
	async getDetails(
		@Query('source') source: string = 'truyenfull',
		@Query('name') name: string,
		@Query('page') page: number = 1,
	) {
		return this.novelService.getDetails(source, name, page);
	}

	@Get('hot')
	@ApiOperation({
		summary: 'Get hot novels',
		description: `
			* The "page" parameter is optional, defaulting to 1. This indicates that this is the first page of the hot novels.
		`,
	})
	@ApiQuery({
		name: 'source',
		required: false,
		description: 'Source of the novel',
		example: 'truyenfull',
	})
	@ApiQuery({
		name: 'page',
		required: false,
		description: 'Page of the hot novels',
		example: 2,
	})
	async getHotNovels(
		@Query('source') source: string = 'truyenfull',
		@Query('page') page: number = 1,
	) {
		return this.novelService.getHotNovels(source, page);
	}

	@Get('search')
	@ApiOperation({
		summary: 'Search novels with keyword',
		description: `
			* The "page" parameter is optional, defaulting to 1. This indicates that this is the first page of the search results.
		`,
	})
	@ApiQuery({
		name: 'source',
		required: false,
		description: 'Source of the novel',
		example: 'truyenfull',
	})
	@ApiQuery({
		name: 'keyword',
		required: true,
		description: 'Keyword to search for',
		example: 'Tự Cẩm',
	})
	@ApiQuery({
		name: 'page',
		required: false,
		description: 'Page of the search results',
		example: 3,
	})
	async searchNovels(
		@Query('source') source: string = 'truyenfull',
		@Query('keyword') keyword: string,
		@Query('page') page: number = 1,
	) {
		return this.novelService.searchNovels(source, keyword, page);
	}

	@Get('genres')
	@ApiOperation({
		summary: 'Get genres',
		description: `
			* The "source" parameter is optional, defaulting to "truyenfull". This indicates that the source of the genres is from Truyen Full.
		`,
	})
	@ApiQuery({
		name: 'source',
		required: false,
		description: 'Source of the genres',
		example: 'truyenfull',
	})
	async getGenres(@Query('source') source: string = 'truyenfull') {
		return this.novelService.getGenres(source);
	}

	@Get('genres/:genre')
	@ApiOperation({
		summary: 'Get novels by genre',
		description: `
			* The "page" parameter is optional, defaulting to 1. This indicates that this is the first page of the novels by genre.
		`,
	})
	@ApiQuery({
		name: 'source',
		required: false,
		description: 'Source of the novels',
		example: 'truyenfull',
	})
	@ApiQuery({
		name: 'page',
		required: false,
		description: 'Page of the novels by genre',
		example: 2,
	})
	@ApiParam({
		name: 'genre',
		required: true,
		description: 'Genre of the novels',
		example: 'ngon-tinh',
	})
	async getNovelsByGenre(
		@Param('genre') genre: string,
		@Query('source') source: string = 'truyenfull',
		@Query('page') page: number = 1,
	) {
		return this.novelService.getNovelsByGenre(source, genre, page);
	}

	@Get(':id/:chapter')
	@ApiOperation({
		summary: 'Get novel chapter',
		description: `
			* The "source" parameter is optional, defaulting to "truyenfull". This indicates that the source of the novel chapter is from Truyen Full.
		`,
	})
	@ApiQuery({
		name: 'source',
		required: false,
		description: 'Source of the novel chapter',
		example: 'truyenfull',
	})
	@ApiParam({
		name: 'id',
		required: true,
		description: 'ID of the novel',
		example: 'tu-cam-270192',
	})
	@ApiParam({
		name: 'chapter',
		required: true,
		description: 'Chapter of the novel',
		example: 1,
	})
	getNovelChapter(
		@Param('id') id: string,
		@Param('chapter') chapter: number,
		@Query('source') source: string = 'truyenfull',
	) {
		return this.novelService.getDetailsChapter(source, id, chapter);
	}
}
