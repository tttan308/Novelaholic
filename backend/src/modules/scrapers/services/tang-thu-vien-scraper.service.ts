import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { IScraper } from './scraper.interface';

@Injectable()
export class TangThuVienScraper implements IScraper {
	async getDetails(url: string, name: string): Promise<any> {
		return [];
	}

	async getDetailsChapter(
		url: string,
		name: string,
		chapterNumber: number,
	): Promise<any> {
		return [];
	}

	async getHotNovels(url: string): Promise<any> {
		return [];
	}

	async searchNovels(url: string, keyword: string): Promise<any> {
		return [];
	}
}
