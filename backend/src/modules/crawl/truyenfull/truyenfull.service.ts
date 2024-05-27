import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { ICrawl } from '../crawl.interface';
import { Details } from './interfaces/details.interface';
import { Implements } from 'src/decorator/implements.decorate';

@Injectable()
@Implements('ICrawl')
export class TruyenFullCrawl implements ICrawl {
	async getDetails(url: string, name: string, page: number): Promise<Details> {
		const urlGetDetails =
			`${url}/${name}` + (page > 1 ? `/trang-${page}/#list-chapter` : '');

		const response = await axios.get(urlGetDetails, {
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
			},
		});

		const html = response.data;
		const $ = cheerio.load(html);

		const details: Details = {
			title: '',
			cover: '',
			author: '',
			genres: [],
			source: '',
			status: '',
			description: '',
			chapters: [],
			maxPage: 1,
		};

		details.title = $('h3.title').text().trim();
		details.cover = $('.book img').attr('src') || '';
		details.author = $('a[itemprop="author"]').text().trim();
		$('a[itemprop="genre"]').each((index, element) => {
			details.genres.push({
				genre: $(element).text().trim(),
				link: $(element).attr('href'),
			});
		});
		details.source = $('.source').text().trim();
		details.status = $('.text-success').text().trim();
		details.description = $('.desc-text.desc-text-full').html()?.trim() || '';

		details.maxPage = parseInt($('#total-page').val() as string, 10) || 1;

		$('.list-chapter li').each((index, element) => {
			const chapterElement = $(element).find('a');
			const chapterTitle = chapterElement.text().replace('Chương ', '').trim();
			const chapterLink = chapterElement.attr('href');
			details.chapters.push({
				title: chapterTitle,
				link: chapterLink,
			});
		});
		return details;
	}

	async getAllChapter(url: string, name: string): Promise<any> {
		const urlGetDetails = `${url}/${name}`;
		const response = await axios.get(urlGetDetails, {
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
			},
		});

		const html = response.data;
		const $ = cheerio.load(html);

		const totalPages = parseInt($('#total-page').val() as string, 10) || 1;
		const chapters = [];
		for (let i = 1; i <= totalPages; i++) {
			const urlGetDetails =
				`${url}/${name}` + (i > 1 ? `/trang-${i}/#list-chapter` : '');
			const response = await axios.get(urlGetDetails, {
				headers: {
					'User-Agent':
						'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
				},
			});

			const html = response.data;
			const $ = cheerio.load(html);

			$('.list-chapter li').each((index, element) => {
				const chapterElement = $(element).find('a');
				const chapterTitle = chapterElement
					.text()
					.replace('Chương ', '')
					.trim();
				const chapterLink = chapterElement.attr('href');
				chapters.push({
					title: chapterTitle,
					link: chapterLink,
				});
			});
		}
		return chapters;
	}

	async getDetailsChapter(
		url: string,
		id: string,
		chapter: number,
	): Promise<any> {
		const urlDetailsChapter = `${url}/${id}` + `/chuong-${chapter}`;

		console.log(urlDetailsChapter);
		const response = await axios.get(urlDetailsChapter, {
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
			},
		});

		const html = response.data;
		const $ = cheerio.load(html);

		const chapterDetails = {
			id: id,
			novelTitle: '',
			chapterTitle: '',
			chapterContent: '',
			prevChapter: '',
			nextChapter: '',
			totalChapters: 0,
		};

		chapterDetails.novelTitle = $('.truyen-title').text().trim();
		chapterDetails.chapterTitle = $('h2 .chapter-title').text().trim();

		$('#chapter-c .ads-responsive').remove();
		$('#chapter-c .bg-info').remove();
		$('#chapter-c .box-notice').remove();
		$('#chapter-c #ads-chapter-google-bottom').remove();
		$('#chapter-c #chapter-end-bot').remove();
		$('#chapter-c .text-center').remove();

		chapterDetails.chapterContent = $('#chapter-c').html()?.trim() || '';
		const prevChapter = $('#prev_chap').attr('href') || '';
		if (prevChapter !== 'javascript:void(0)	') {
			chapterDetails.prevChapter =
				'/novels/' + id + '/' + (Number(chapter) - 1);
		} else {
			chapterDetails.prevChapter = '';
		}
		const nextChapter = $('#next_chap').attr('href') || '';
		if (nextChapter !== 'javascript:void(0)') {
			chapterDetails.nextChapter =
				'/novels/' + id + '/' + (Number(chapter) + 1);
		} else {
			chapterDetails.nextChapter = '';
		}

		const chapters = await this.getAllChapter(url, id);
		chapterDetails.totalChapters = chapters.length;

		return chapterDetails;
	}

	async getHotNovels(url: string, page: number): Promise<any> {
		let urlHotNovels = `${url}/danh-sach/truyen-hot/`;
		if (page > 1) urlHotNovels += `trang-${page}/`;

		const response = await axios.get(urlHotNovels, {
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
			},
		});
		const html = response.data;
		const $ = cheerio.load(html);
		const hotNovels = [];

		const lastPageLink = $('a:contains("Cuối")').attr('href');

		if (!lastPageLink) {
			throw new Error('Unable to find the total pages.');
		}

		const totalPageMatch = lastPageLink.match(/trang-(\d+)\//);
		const totalPages = totalPageMatch ? parseInt(totalPageMatch[1], 10) : 1;

		$('.list.list-truyen.col-xs-12 .row').each((index, element) => {
			const cover =
				$(element).find('.lazyimg').data('image') ||
				$(element).find('.lazyimg').data('desk-image');
			if (!cover) return false;

			const titleElement = $(element).find('.truyen-title a');
			const title = titleElement.text().trim();
			const titleLink = titleElement.attr('href');
			const splitTitleLink = titleLink?.split('/');
			const id = splitTitleLink?.[splitTitleLink.length - 2];
			const author = $(element).find('.author').text().trim();
			const isFull = $(element).find('.label-title.label-full').length > 0;
			const isHot = $(element).find('.label-title.label-hot').length > 0;
			const chapterElement = $(element).find('.col-xs-2.text-info a');
			const chapter = chapterElement.text().replace('Chương ', '').trim();
			const chapterLink = chapterElement.attr('href');

			hotNovels.push({
				id,
				cover,
				title,
				titleLink,
				isFull,
				isHot,
				author,
				chapter,
				chapterLink,
			});
		});

		const currentPage = Number(page);

		return {
			hotNovels,
			totalPages,
			currentPage,
		};
	}

	async searchNovels(url: string, keyword: string, page: number): Promise<any> {
		let searchUrl = `${url}/tim-kiem/?tukhoa=${keyword}`;
		if (page > 1) {
			searchUrl += `&page=${page}`;
		}

		const response = await axios.get(searchUrl, {
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
			},
		});

		const html = response.data;
		const $ = cheerio.load(html);
		const searchResults = [];

		$('.list.list-truyen.col-xs-12 .row').each((index, element) => {
			const cover =
				$(element).find('.lazyimg').data('image') ||
				$(element).find('.lazyimg').data('desk-image');
			if (!cover) return false;

			const titleElement = $(element).find('.truyen-title a');
			const title = titleElement.text().trim();
			const titleLink = titleElement.attr('href');
			const splitTitleLink = titleLink?.split('/');
			const id = splitTitleLink?.[splitTitleLink.length - 2];
			const author = $(element).find('.author').text().trim();
			const isFull = $(element).find('.label-title.label-full').length > 0;
			const isHot = $(element).find('.label-title.label-hot').length > 0;
			const chapterElement = $(element).find('.col-xs-2.text-info a');
			const chapter = chapterElement.text().replace('Chương ', '').trim();
			const chapterLink = chapterElement.attr('href');

			searchResults.push({
				id,
				cover,
				title,
				titleLink,
				isFull,
				isHot,
				author,
				chapter,
				chapterLink,
			});
		});

		const lastPageLink = $('a:contains("Cuối")').last().attr('href');

		if (!lastPageLink) {
			return {
				searchResults,
				totalPages: 1,
				currentPage: 1,
			};
		}

		const totalPageMatch = lastPageLink.match(/page=(\d+)/);
		const totalPages = totalPageMatch ? parseInt(totalPageMatch[1], 10) : 1;
		const currentPage = Number(page);

		return {
			searchResults,
			totalPages,
			currentPage,
		};
	}

	async getGenres(url: string): Promise<any> {
		const genresUrl = `${url}/`;

		const response = await axios.get(genresUrl, {
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
			},
		});

		const html = response.data;
		const $ = cheerio.load(html);
		const genres = [];

		const secondDropdown = $('ul.control.nav.navbar-nav > li.dropdown').eq(1);

		secondDropdown
			.find('div.dropdown-menu.multi-column ul.dropdown-menu li a')
			.each((index, element) => {
				const href = $(element).attr('href');
				const id = href
					.split('/')
					.filter((part) => part)
					.pop();
				const name = $(element).text().trim();
				genres.push({ id, href, name });
			});

		return genres;
	}

	async getNovelsByGenre(
		url: string,
		genre: string,
		page: number,
	): Promise<any> {
		let genreUrl = `${url}` + '/the-loai/' + `${genre}`;
		if (page > 1) {
			genreUrl += `/trang-${page}`;
		}

		console.log(genreUrl);
		const response = await axios.get(genreUrl, {
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
			},
		});

		const html = response.data;
		const $ = cheerio.load(html);
		const novels = [];

		const lastPageLink = $('a:contains("Cuối")').attr('href');

		if (!lastPageLink) {
			throw new Error('Unable to find the total pages.');
		}

		const totalPageMatch = lastPageLink.match(/trang-(\d+)/);
		const totalPages = totalPageMatch ? parseInt(totalPageMatch[1], 10) : 1;

		$('.list.list-truyen.col-xs-12 .row').each((index, element) => {
			const cover =
				$(element).find('.lazyimg').data('image') ||
				$(element).find('.lazyimg').data('desk-image');
			if (!cover) return false;

			const titleElement = $(element).find('.truyen-title a');
			const title = titleElement.text().trim();
			const titleLink = titleElement.attr('href');
			const splitTitleLink = titleLink?.split('/');
			const id = splitTitleLink?.[splitTitleLink.length - 2];
			const author = $(element).find('.author').text().trim();
			const isFull = $(element).find('.label-title.label-full').length > 0;
			const isHot = $(element).find('.label-title.label-hot').length > 0;
			const chapterElement = $(element).find('.col-xs-2.text-info a');
			const chapter = chapterElement.text().replace('Chương ', '').trim();
			const chapterLink = chapterElement.attr('href');

			novels.push({
				id,
				cover,
				title,
				titleLink,
				isFull,
				isHot,
				author,
				chapter,
				chapterLink,
			});
		});

		const currentPage = Number(page);

		return {
			novels,
			totalPages,
			currentPage,
		};
	}
}
