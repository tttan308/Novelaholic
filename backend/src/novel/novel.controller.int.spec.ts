import { Test, TestingModule } from '@nestjs/testing';
import { NovelController } from './novel.controller';
import { NovelService } from './novel.service';
import { PluginFactory } from '../plugins/plugin.factory';

describe('NovelController', () => {
	let controller: NovelController;
	let service: NovelService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [NovelController],
			providers: [
				NovelService,
				{
					provide: PluginFactory,
					useValue: {
						getPlugin: jest.fn().mockReturnValue({
							getDetails: jest.fn().mockResolvedValue({}),
							getDetailsChapter: jest.fn().mockResolvedValue({}),
							getHotNovels: jest.fn().mockResolvedValue([]),
							searchNovels: jest.fn().mockResolvedValue([]),
							getGenres: jest.fn().mockResolvedValue([]),
							getNovelsByGenre: jest.fn().mockResolvedValue([]),
						}),
					},
				},
			],
		}).compile();

		controller = module.get<NovelController>(NovelController);
		service = module.get<NovelService>(NovelService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('getDetails', () => {
		it('should return novel details', async () => {
			const source = 1;
			const name = 'test-name';
			const page = 1;
			const result = { details: 'some details' };
			jest.spyOn(service, 'getDetails').mockResolvedValue(result);

			expect(await controller.getDetails(source, name, page)).toBe(result);
			expect(service.getDetails).toHaveBeenCalledWith(source, name, page);
		});
	});

	describe('getHotNovels', () => {
		it('should return hot novels', async () => {
			const source = 1;
			const page = 1;
			const result = [{ title: 'hot novel' }];
			jest.spyOn(service, 'getHotNovels').mockResolvedValue(result);

			expect(await controller.getHotNovels(source, page)).toBe(result);
			expect(service.getHotNovels).toHaveBeenCalledWith(source, page);
		});
	});

	describe('searchNovels', () => {
		it('should return search results', async () => {
			const source = 1;
			const keyword = 'keyword';
			const page = 1;
			const result = [{ title: 'searched novel' }];
			jest.spyOn(service, 'searchNovels').mockResolvedValue(result);

			expect(await controller.searchNovels(source, keyword, page)).toBe(result);
			expect(service.searchNovels).toHaveBeenCalledWith(source, keyword, page);
		});
	});

	describe('getGenres', () => {
		it('should return genres', async () => {
			const source = 1;
			const result = ['genre1', 'genre2'];
			jest.spyOn(service, 'getGenres').mockResolvedValue(result);

			expect(await controller.getGenres(source)).toBe(result);
			expect(service.getGenres).toHaveBeenCalledWith(source);
		});
	});

	describe('getNovelsByGenre', () => {
		it('should return novels by genre', async () => {
			const source = 1;
			const genre = 'genre';
			const page = 1;
			const result = [{ title: 'novel by genre' }];
			jest.spyOn(service, 'getNovelsByGenre').mockResolvedValue(result);

			expect(await controller.getNovelsByGenre(genre, source, page)).toBe(
				result,
			);
			expect(service.getNovelsByGenre).toHaveBeenCalledWith(
				source,
				genre,
				page,
			);
		});
	});

	describe('getNovelChapter', () => {
		it('should return novel chapter details', async () => {
			const source = 1;
			const id = 'novel-id';
			const chapter = 1;
			const result = { title: 'chapter title' };
			jest.spyOn(service, 'getDetailsChapter').mockResolvedValue(result);

			expect(await controller.getNovelChapter(id, chapter, source)).toBe(
				result,
			);
			expect(service.getDetailsChapter).toHaveBeenCalledWith(
				source,
				id,
				chapter,
			);
		});
	});
});
