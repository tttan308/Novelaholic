import { Test, TestingModule } from '@nestjs/testing';
import { NovelService } from './novel.service';
import { PluginFactory } from '../plugins/plugin.factory';

describe('NovelService', () => {
	let service: NovelService;
	let pluginFactory: PluginFactory;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				NovelService,
				{
					provide: PluginFactory,
					useValue: {
						getPlugin: jest.fn().mockReturnValue({
							getDetails: jest.fn(),
							getDetailsChapter: jest.fn(),
							getHotNovels: jest.fn(),
							searchNovels: jest.fn(),
							getGenres: jest.fn(),
							getNovelsByGenre: jest.fn(),
						}),
					},
				},
			],
		}).compile();

		service = module.get<NovelService>(NovelService);
		pluginFactory = module.get<PluginFactory>(PluginFactory);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('getDetails', () => {
		it('should call getDetails with correct parameters', async () => {
			const source = 1;
			const name = 'test-name';
			const page = 1;
			const plugin = pluginFactory.getNovelPlugin(source);
			await service.getDetails(source, name, page);
			expect(plugin.getDetails).toHaveBeenCalledWith(name, page);
		});
	});

	describe('getDetailsChapter', () => {
		it('should call getDetailsChapter with correct parameters', async () => {
			const source = 1;
			const id = 'novel-id';
			const chapter = 1;
			const plugin = pluginFactory.getNovelPlugin(source);
			await service.getDetailsChapter(source, id, chapter);
			expect(plugin.getDetailsChapter).toHaveBeenCalledWith(id, chapter);
		});
	});

	describe('getHotNovels', () => {
		it('should call getHotNovels with correct parameters', async () => {
			const source = 1;
			const page = 1;
			const plugin = pluginFactory.getNovelPlugin(source);
			await service.getHotNovels(source, page);
			expect(plugin.getHotNovels).toHaveBeenCalledWith(page);
		});
	});

	describe('searchNovels', () => {
		it('should call searchNovels with correct parameters', async () => {
			const source = 1;
			const keyword = 'keyword';
			const page = 1;
			const plugin = pluginFactory.getNovelPlugin(source);
			await service.searchNovels(source, keyword, page);
			expect(plugin.searchNovels).toHaveBeenCalledWith(keyword, page);
		});
	});

	describe('getGenres', () => {
		it('should call getGenres with correct parameters', async () => {
			const source = 1;
			const plugin = pluginFactory.getNovelPlugin(source);
			await service.getGenres(source);
			expect(plugin.getGenres).toHaveBeenCalled();
		});
	});

	describe('getNovelsByGenre', () => {
		it('should call getNovelsByGenre with correct parameters', async () => {
			const source = 1;
			const genre = 'genre';
			const page = 1;
			const plugin = pluginFactory.getNovelPlugin(source);
			await service.getNovelsByGenre(source, genre, page);
			expect(plugin.getNovelsByGenre).toHaveBeenCalledWith(genre, page);
		});
	});
});
