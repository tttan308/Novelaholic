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

export class TangThuVienPlugin implements Plugin {
	id = 3;
	name = 'Tàng Thư Viện';
	url = 'https://truyen.tangthuvien.vn/';

	private readonly axiosConfig: AxiosRequestConfig = {
		headers: {
			'User-Agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
		},
	};

	init(): DynamicModule {
		return {
			module: TangThuVienPlugin,
			providers: [
				{
					provide: 'Plugin',
					useClass: TangThuVienPlugin,
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
		const url = `https://truyen.tangthuvien.vn/doc-truyen/${name}`;

		let $ = await this.fetchHtml(url);

		const details = new Details();

		details.title = $('h1').text().trim();
		details.cover = $('.book-img img').attr('src') || '';
		details.author = $('.tag a').first().text().trim();
		details.status = $('.tag .blue').eq(1).text().trim();
		details.description = $('.book-intro p').text().trim();
		details.source = url;

		$('span a').each((index, element) => {
			const genreName = $(element).text().trim();
			const genreHref = $(element).attr('href');
			let type = genreHref?.split('/').slice(-1)[0];
			type = '/novels/genres/' + type;

			if (genreName == 'Trang chủ' || genreHref == 'javascript:void(0);')
				return;

			if (genreName && genreHref) {
				details.genres.push({
					name: genreName,
					href: type,
				});
			}
		});

		const bookId = $('meta[name="book_detail"]').attr('content');
		const limit = 50;
		const chapterText = $('#j-bookCatalogPage').text();
		const match = chapterText.match(/\d+/);
		details.maxPage = Math.ceil(Number(match ? match[0] : 1) / limit);
		const apiUrl = `https://truyen.tangthuvien.vn/doc-truyen/page/${bookId}?page=${--page}&limit=${limit}&web=1`;
		const response = await axios.get(apiUrl, this.axiosConfig);
		$ = cheerio.load(response.data);

		$('ul.cf li').each((i, element) => {
			const chapterLink = $(element).find('a').attr('href');
			const parts = chapterLink?.split('/');
			const link =
				'/novels/' + parts?.slice(-2).join('/').replace('chuong-', '');
			const chapterTitle = $(element).find('a').text().trim();
			if (chapterLink && chapterTitle) {
				details.chapters.push({
					title: chapterTitle,
					link: link,
				});
			}
		});

		return details;
	}

	async getAllChapter(name: string): Promise<Chapter[]> {
		const url = `https://truyen.tangthuvien.vn/doc-truyen/${name}`;
		const $ = await this.fetchHtml(url);

		const chapters: Chapter[] = [];

		const chapterList = $('.catalog-content-wrap').find('#max-volume ul.cf li');

		chapterList.each((i, element) => {
			const chapterLink = $(element).find('a').attr('href');
			const chapterTitle = $(element).find('a').text().trim();
			if (chapterLink && chapterTitle) {
				chapters.push({
					title: chapterTitle,
					link: chapterLink,
				});
			}
		});

		return chapters;
	}

	async getDetailsChapter(id: string, chapter: number): Promise<any> {
		const urlSize = `https://truyen.tangthuvien.vn/doc-truyen/${id}`;

		let $ = await this.fetchHtml(urlSize);
		const chapterText = $('#j-bookCatalogPage').text();
		const match = chapterText.match(/\d+/);
		const maxPage = Math.ceil(Number(match ? match[0] : 1));

		const url = `https://truyen.tangthuvien.vn/doc-truyen/${id}/chuong-${chapter}`;
		$ = await this.fetchHtml(url);

		let prevChapter = '';
		if (chapter > 1) {
			prevChapter = `/novels/${id}/${Number(chapter) - 1}`;
		}

		let nextChapter = '';
		if (chapter < maxPage) {
			nextChapter = `/novels/${id}/${Number(chapter) + 1}`;
		}

		const chapterDetails = {
			id,
			novelTitle: $('.truyen-title a').text().trim(),
			chapterTitle: $('h2').text().trim(),
			chapterContent: $('.box-chap').text().trim(),
			prevChapter,
			nextChapter,
			totalChapters: maxPage,
		};

		return chapterDetails;
	}

	async getHotNovels(page: number): Promise<NovelList> {
		const url = `https://truyen.tangthuvien.vn/tong-hop?rank=vw&time=m&page=${page > 1 ? page : ''}`;
		const $ = await this.fetchHtml(url);
		const hotNovels: HotNovel[] = [];

		$('#rank-view-list .book-img-text ul li').each((index, element) => {
			const cover = $(element).find('.book-img-box img').attr('src') || '';
			const titleElement = $(element).find('.book-mid-info h4 a');
			const title = titleElement.text().trim() || '';
			const titleLink = titleElement.attr('href') || '';
			const id = titleLink.split('/').slice(-1)[0];
			const authorElement = $(element).find('.author a.name');
			const author = authorElement.text().trim() || '';
			const chapterElement = $(element).find('.author span.KIBoOgno');
			const chapter = chapterElement.text().trim() || '';
			const chapterLink =
				$(element).find('.book-right-info .red-btn').attr('href') || '';
			const parts = chapterLink?.split('/');
			const link =
				'/novels/' +
				parts
					?.slice(-2)
					.join('/')
					.replace('chuong-', '')
					.replace('?read_now=1', '');
			const isFull =
				$(element).find('.author span').last().text().trim() ===
				'Đã hoàn thành';
			const isHot = true;

			hotNovels.push(
				new HotNovel(
					id,
					cover,
					title,
					titleLink,
					isFull,
					isHot,
					author,
					chapter,
					link,
				),
			);
		});

		const totalPages = parseInt($('.pagination li').last().prev().text()) || 1;

		return new NovelList(hotNovels, totalPages, Number(page));
	}

	async searchNovels(keyword: string, page: number): Promise<NovelList> {
		const url = `https://truyen.tangthuvien.vn/ket-qua-tim-kiem?term=${keyword}${page > 1 ? `&page=${page}` : ''}`;
		const $ = await this.fetchHtml(url);
		const searchResults: SearchResult[] = [];

		$('#rank-view-list .book-img-text ul li').each((index, element) => {
			const cover = $(element).find('.book-img-box img').attr('src') || '';
			const titleElement = $(element).find('.book-mid-info h4 a');
			const title = titleElement.text().trim() || '';
			const titleLink = titleElement.attr('href') || '';
			const parts1 = titleLink.split('/');
			const titleId = '/novels/' + parts1.slice(-1)[0];

			const id = titleLink.split('/').slice(-1)[0];
			const authorElement = $(element).find('.author a.name');
			const author = authorElement.text().trim() || '';
			const chapterElement = $(element).find('.author span.KIBoOgno');
			const chapter = chapterElement.text().trim() || '';
			const chapterLink =
				$(element).find('.book-right-info .red-btn').attr('href') || '';
			const parts = chapterLink?.split('/');
			const link =
				'/novels/' +
				parts
					?.slice(-2)
					.join('/')
					.replace('chuong-', '')
					.replace('?read_now=1', '');
			const isFull =
				$(element).find('.author span').last().text().trim() ===
				'Đã hoàn thành';
			const isHot = true;

			searchResults.push(
				new HotNovel(
					id,
					cover,
					title,
					titleId,
					isFull,
					isHot,
					author,
					chapter,
					link,
				),
			);
		});

		const totalPages = parseInt($('.pagination li').last().prev().text()) || 1;

		return new NovelList(searchResults, totalPages, Number(page));
	}

	async getGenres(): Promise<Genre[]> {
		const url = `https://truyen.tangthuvien.vn/`;
		const $ = await this.fetchHtml(url);
		const genres: Genre[] = [];

		$('#classify-list dl dd').each((index, element) => {
			const href = $(element).find('a').attr('href') || '';
			let type = href.split('/').slice(-1)[0];
			if (type == 'bang-xep-hang') type = 'tat-ca';
			if (type == '') return;
			const name = $(element).find('.info i').text().trim() || '';
			type = '/novels/genres/' + type;
			if (name && type) {
				genres.push(new Genre(name, type));
			}
		});

		return genres;
	}

	async getNovelsByGenre(genre: string, page: number): Promise<NovelList> {
		const novelsLink: Map<string, number> = new Map([
			['tat-ca', 0],
			['tien-hiep', 1],
			['huyen-huyen', 2],
			['do-thi', 3],
			['khoa-huyen', 4],
			['ky-huyen', 5],
			['vo-hiep', 6],
			['lich-su', 7],
			['dong-nhan', 8],
			['quan-su', 9],
			['du-hi', 10],
			['canh-ky', 11],
			['linh-di', 12],
		]);

		const url = `https://truyen.tangthuvien.vn/bang-xep-hang?selOrder=view_&category=${novelsLink.get(genre)}&selComplete=0&selTime=all&page=${page > 1 ? page : ''}`;
		console.log(url);
		const $ = await this.fetchHtml(url);
		const novels: HotNovel[] = [];

		$('.row').each((index, element) => {
			const cover = $(element).find('.item-image img').attr('src') || '';
			if (!cover) return;
			const titleElement = $(element).find('.truyen-title a');
			const title = titleElement.text().trim() || '';
			const titleLink = titleElement.attr('href') || '';
			const id = titleLink.split('/').slice(-1)[0];
			const author =
				$(element)
					.find('.item-author')
					.first()
					.text()
					.replace('Tác giả: ', '')
					.trim() || '';
			const genre =
				$(element)
					.find('.item-author')
					.eq(1)
					.text()
					.replace('Thể loại: ', '')
					.trim() || '';
			const views =
				$(element)
					.find('.item-update')
					.eq(0)
					.text()
					.replace('Lượt xem: ', '')
					.trim() || '';
			const status =
				$(element)
					.find('.item-update')
					.eq(1)
					.text()
					.replace('Tình trạng: ', '')
					.trim() || '';
			const chapters =
				$(element)
					.find('.item-update')
					.eq(2)
					.text()
					.replace('Số chương: ', '')
					.trim() || '';
			const updateDate =
				$(element)
					.find('.text-info .chapter-text')
					.text()
					.replace('Cập nhật: ', '')
					.trim() || '';

			const isFull = status === 'Hoàn thành';
			const isHot = true;
			const chapterLink = titleLink;

			novels.push(
				new HotNovel(
					id,
					cover,
					title,
					titleLink,
					isFull,
					isHot,
					author,
					chapters,
					chapterLink,
				),
			);
		});

		const totalPages = parseInt($('.pagination li').last().prev().text()) || 1;

		return new NovelList(novels, totalPages, page);
	}
}

export default TangThuVienPlugin;
