import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { IScraper } from './scraper.interface';
import { Details } from './truyenfull-interface/Details.interface';

@Injectable()
export class TruyenFullScraper implements IScraper {
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

	async getDetailsChapter(
		url: string,
		name: string,
		page: number,
		chapterNumber: number,
	): Promise<any> {
		const lastSlashIndex = name.lastIndexOf('/');

		if (lastSlashIndex !== -1) {
			name = name.substring(0, lastSlashIndex);
		}

		const urlDetailsChapter =
			`${url}/${name}` +
			(page > 1 ? `/trang-${page}/#list-chapter` : '') +
			`/chuong-${chapterNumber}`;
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
			novelTitle: '',
			chapterTitle: '',
			chapterContent: '',
			prevChapter: '',
			nextChapter: '',
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
		chapterDetails.prevChapter = $('#prev_chap').attr('href') || '';
		chapterDetails.nextChapter = $('#next_chap').attr('href') || '';

		return chapterDetails;
	}

	async getHotNovels(url: string): Promise<any> {
		const response = await axios.get(url, {
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
			},
		});
		const html = response.data;
		const $ = cheerio.load(html);
		const hotNovels = [];

		$('.index-intro .item').each((index, element) => {
			const title = $(element).find('.title').text().trim();
			const link = $(element).find('a').attr('href');
			const cover = $(element).find('img').attr('src');

			hotNovels.push({ title, link, cover });
		});

		return hotNovels;
	}

	async searchNovels(url: string, keyword: string): Promise<any> {
		const searchUrl = `${url}/tim-kiem/?tukhoa=${keyword}`;

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
			const titleElement = $(element).find('.truyen-title a');
			const title = titleElement.text().trim();
			const titleLink = titleElement.attr('href');
			const author = $(element).find('.author').text().trim();
			const isFull = $(element).find('.label-title.label-full').length > 0;
			const isHot = $(element).find('.label-title.label-hot').length > 0;
			const chapterElement = $(element).find('.col-xs-2.text-info a');
			const chapter = chapterElement.text().replace('Chương ', '').trim();
			const chapterLink = chapterElement.attr('href');

			searchResults.push({
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

		return searchResults;
	}
}
