import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { ICrawl } from '../crawl.interface';

@Injectable()
export class TangThuVienCrawl implements ICrawl {
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

	async getGenres(url: string): Promise<any> {
		return [];
	}

	async getNovelsByGenre(
		url: string,
		genre: string,
		page: number,
	): Promise<any> {
		return [];
	}
}
