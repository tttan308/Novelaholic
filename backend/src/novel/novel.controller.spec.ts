import { Test, TestingModule } from '@nestjs/testing';
import { NovelController } from './novel.controller';
import { NovelService } from './novel.service';

describe('NovelController', () => {
	let controller: NovelController;
	let service: NovelService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [NovelController],
			providers: [
				{
					provide: NovelService,
					useValue: {
						getDetails: jest.fn(),
						getHotNovels: jest.fn(),
						searchNovels: jest.fn(),
						getGenres: jest.fn(),
						getNovelsByGenre: jest.fn(),
						getDetailsChapter: jest.fn(),
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
		it('should call novelService.getDetails with correct parameters', async () => {
			const source = 1;
			const name = 'test-name';
			const page = 1;
			await controller.getDetails(source, name, page);
			expect(service.getDetails).toHaveBeenCalledWith(source, name, page);
		});
	});

	describe('getHotNovels', () => {
		it('should call novelService.getHotNovels with correct parameters', async () => {
			const source = 1;
			const page = 1;
			await controller.getHotNovels(source, page);
			expect(service.getHotNovels).toHaveBeenCalledWith(source, page);
		});
	});

	describe('searchNovels', () => {
		it('should call novelService.searchNovels with correct parameters', async () => {
			const source = 1;
			const keyword = 'keyword';
			const page = 1;
			await controller.searchNovels(source, keyword, page);
			expect(service.searchNovels).toHaveBeenCalledWith(source, keyword, page);
		});
	});

	describe('getGenres', () => {
		it('should call novelService.getGenres with correct parameters', async () => {
			const source = 1;
			await controller.getGenres(source);
			expect(service.getGenres).toHaveBeenCalledWith(source);
		});
	});

	describe('getNovelsByGenre', () => {
		it('should call novelService.getNovelsByGenre with correct parameters', async () => {
			const source = 1;
			const genre = 'genre';
			const page = 1;
			await controller.getNovelsByGenre(genre, source, page);
			expect(service.getNovelsByGenre).toHaveBeenCalledWith(
				source,
				genre,
				page,
			);
		});
	});

	describe('getNovelChapter', () => {
		it('should call novelService.getDetailsChapter with correct parameters', async () => {
			const id = 'novel-id';
			const chapter = 1;
			const source = 1;
			await controller.getNovelChapter(id, chapter, source);
			expect(service.getDetailsChapter).toHaveBeenCalledWith(
				source,
				id,
				chapter,
			);
		});
	});
});
