import axios, { AxiosRequestConfig } from 'axios';
import * as cheerio from 'cheerio';
import { Plugin } from './plugin.interface';
import { DynamicModule } from '@nestjs/common';
import { HotNovel } from './models/hot-novel.model';
import { NovelList } from './models/novel-list.model';
import { Details } from './models/details.model';
import { Genre } from './models/genre.model';
import { Chapter } from './models/chapter.model';
import { SearchResult } from './models/search-result.model';

export class TruyenFullPlugin implements Plugin {
	id = 1;
	name = 'truyenfull';

	private readonly axiosConfig: AxiosRequestConfig = {
		headers: {
			'User-Agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
		},
	};

	init(): DynamicModule {
		return {
			module: TruyenFullPlugin,
			providers: [
				{
					provide: 'Plugin',
					useClass: TruyenFullPlugin,
				},
			],
			exports: ['Plugin'],
		};
	}

	private async fetchHtml(url: string): Promise<cheerio.CheerioAPI> {
		const response = await axios.get(url, this.axiosConfig);
		return cheerio.load(response.data);
	}

	async getDetails(name: string, page: number): Promise<Details> {
		const url = `https://truyenfull.vn/${name}${page > 1 ? `/trang-${page}/#list-chapter` : ''}`;

		const $ = await this.fetchHtml(url);

		const details = new Details();

		details.title = $('h3.title').text().trim();
		details.cover = $('.book img').attr('src') || '';
		details.author = $('a[itemprop="author"]').text().trim();
		details.source = $('.source').text().trim();
		details.status = $('.text-success').text().trim();
		$('a[itemprop="genre"]').each((index, element) => {
			details.genres.push({
				name: $(element).text().trim(),
				href: $(element).attr('href') || '',
			});
		});
		details.description = $('.desc-text.desc-text-full').html()?.trim() || '';
		details.maxPage = parseInt($('#total-page').val() as string, 10) || 1;
		$('.list-chapter li').each((index, element) => {
			const chapterElement = $(element).find('a');
			const chapterTitle = chapterElement.text().replace('Chương ', '').trim();
			const chapterLink = chapterElement.attr('href');
			details.chapters.push({
				title: chapterTitle,
				link: chapterLink || '',
			});
		});
		return details;
	}

	async getAllChapter(name: string): Promise<Chapter[]> {
		const url = `https://truyenfull.vn/${name}`;
		const $ = await this.fetchHtml(url);

		const totalPages = parseInt($('#total-page').val() as string, 10) || 1;
		const chapters: Chapter[] = [];

		for (let i = 1; i <= totalPages; i++) {
			const pageUrl = `https://truyenfull.vn/${name}${i > 1 ? `/trang-${i}/#list-chapter` : ''}`;
			const $ = await this.fetchHtml(pageUrl);

			$('.list-chapter li').each((_, el) => {
				const chapter = new Chapter(
					$(el).find('a').text().replace('Chương ', '').trim(),
					$(el).find('a').attr('href')!,
				);
				chapters.push(chapter);
			});
		}
		return chapters;
	}

	async getDetailsChapter(id: string, chapter: number): Promise<any> {
		const url = `https://truyenfull.vn/${id}/chuong-${chapter}`;
		const $ = await this.fetchHtml(url);

		const chapterDetails = {
			id,
			novelTitle: $('.truyen-title').text().trim(),
			chapterTitle: $('h2 .chapter-title').text().trim(),
			chapterContent: '',
			prevChapter: '',
			nextChapter: '',
			totalChapters: 0,
		};

		$(
			'#chapter-c .ads-responsive, #chapter-c .bg-info, #chapter-c .box-notice, #chapter-c #ads-chapter-google-bottom, #chapter-c #chapter-end-bot, #chapter-c .text-center',
		).remove();
		chapterDetails.chapterContent = $('#chapter-c').html()?.trim() || '';

		const prevChapter = $('#prev_chap').attr('href') || '';
		chapterDetails.prevChapter =
			prevChapter !== 'javascript:void(0)'
				? `/novels/${id}/${chapter - 1}`
				: '';

		const nextChapter = $('#next_chap').attr('href') || '';
		chapterDetails.nextChapter =
			nextChapter !== 'javascript:void(0)'
				? `/novels/${id}/${chapter + 1}`
				: '';

		const chapters = await this.getAllChapter(id);
		chapterDetails.totalChapters = chapters.length;

		return chapterDetails;
	}

	async getHotNovels(page: number): Promise<NovelList> {
		const url = `https://truyenfull.vn/danh-sach/truyen-hot/${page > 1 ? `trang-${page}/` : ''}`;
		const $ = await this.fetchHtml(url);
		const hotNovels: HotNovel[] = [];

		$('.list.list-truyen.col-xs-12 .row').each((_, el) => {
			const cover =
				$(el).find('.lazyimg').data('image') ||
				$(el).find('.lazyimg').data('desk-image');
			if (!cover) return;

			const titleElement = $(el).find('.truyen-title a');
			const title = titleElement.text().trim();
			const titleLink = titleElement.attr('href');
			const id = titleLink?.split('/').slice(-2)[0];
			const author = $(el).find('.author').text().trim();
			const isFull = $(el).find('.label-title.label-full').length > 0;
			const isHot = $(el).find('.label-title.label-hot').length > 0;
			const chapterElement = $(el).find('.col-xs-2.text-info a');
			const chapter = chapterElement.text().replace('Chương ', '').trim();
			const chapterLink = chapterElement.attr('href');

			hotNovels.push(
				new HotNovel(
					id || '',
					cover.toString(),
					title,
					titleLink!,
					isFull,
					isHot,
					author,
					chapter,
					chapterLink!,
				),
			);
		});

		const lastPageLink = $('a:contains("Cuối")').attr('href');
		const totalPageMatch = lastPageLink?.match(/trang-(\d+)\//);
		const totalPages = totalPageMatch ? parseInt(totalPageMatch[1], 10) : 1;

		return new NovelList(hotNovels, totalPages, page);
	}

	async searchNovels(keyword: string, page: number): Promise<NovelList> {
		const url = `https://truyenfull.vn/tim-kiem/?tukhoa=${keyword}${page > 1 ? `&page=${page}` : ''}`;
		const $ = await this.fetchHtml(url);
		const searchResults: SearchResult[] = [];

		$('.list.list-truyen.col-xs-12 .row').each((_, el) => {
			const cover =
				$(el).find('.lazyimg').data('image') ||
				$(el).find('.lazyimg').data('desk-image');
			if (!cover) return;

			const titleElement = $(el).find('.truyen-title a');
			const title = titleElement.text().trim();
			const titleLink = titleElement.attr('href');
			const id = titleLink?.split('/').slice(-2)[0];
			const author = $(el).find('.author').text().trim();
			const isFull = $(el).find('.label-title.label-full').length > 0;
			const isHot = $(el).find('.label-title.label-hot').length > 0;
			const chapterElement = $(el).find('.col-xs-2.text-info a');
			const chapter = chapterElement.text().replace('Chương ', '').trim();
			const chapterLink = chapterElement.attr('href');

			searchResults.push(
				new SearchResult(
					id || '',
					cover.toString(),
					title,
					titleLink!,
					isFull,
					isHot,
					author,
					chapter,
					chapterLink!,
				),
			);
		});

		const lastPageLink = $('a:contains("Cuối")').last().attr('href');
		const totalPageMatch = lastPageLink?.match(/page=(\d+)/);
		const totalPages = totalPageMatch ? parseInt(totalPageMatch[1], 10) : 1;

		return new NovelList(searchResults, totalPages, page);
	}

	async getGenres(): Promise<Genre[]> {
		const url = `https://truyenfull.vn/`;
		const $ = await this.fetchHtml(url);
		const genres: Genre[] = [];

		$('ul.control.nav.navbar-nav > li.dropdown')
			.eq(1)
			.find('div.dropdown-menu.multi-column ul.dropdown-menu li a')
			.each((_, el) => {
				const href = $(el).attr('href');
				const name = $(el).text().trim();
				genres.push(new Genre(name, href!));
			});

		return genres;
	}

	async getNovelsByGenre(genre: string, page: number): Promise<NovelList> {
		const url = `https://truyenfull.vn/the-loai/${genre}${page > 1 ? `/trang-${page}` : ''}`;
		const $ = await this.fetchHtml(url);
		const novels: HotNovel[] = [];

		const lastPageLink = $('a:contains("Cuối ")').attr('href');
		const totalPageMatch = lastPageLink?.match(/trang-(\d+)/);
		const totalPages = totalPageMatch ? parseInt(totalPageMatch[1], 10) : 1;

		$('.list.list-truyen.col-xs-12 .row').each((_, el) => {
			const cover =
				$(el).find('.lazyimg').data('image') ||
				$(el).find('.lazyimg').data('desk-image');
			if (!cover) return;

			const titleElement = $(el).find('.truyen-title a');
			const title = titleElement.text().trim();
			const titleLink = titleElement.attr('href');
			const id = titleLink?.split('/').slice(-2)[0];
			const author = $(el).find('.author').text().trim();
			const isFull = $(el).find('.label-title.label-full').length > 0;
			const isHot = $(el).find('.label-title.label-hot').length > 0;
			const chapterElement = $(el).find('.col-xs-2.text-info a');
			const chapter = chapterElement.text().replace('Chương ', '').trim();
			const chapterLink = chapterElement.attr('href');

			novels.push(
				new HotNovel(
					id!,
					cover.toString(),
					title,
					titleLink!,
					isFull,
					isHot,
					author,
					chapter,
					chapterLink!,
				),
			);
		});

		return new NovelList(novels, totalPages, page);
	}
}

export default TruyenFullPlugin;
