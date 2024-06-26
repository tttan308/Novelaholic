import axios, { AxiosRequestConfig } from 'axios';
import * as cheerio from 'cheerio';
import { NovelPlugin } from './novel-plugin.interface';
import { DynamicModule } from '@nestjs/common';
import { Novel } from '../models/novel.model';
import { NovelList } from '../models/novel-list.model';
import { Details } from '../models/details.model';
import { Genre } from '../models/genre.model';
import { Chapter } from '../models/chapter.model';
import { SearchResult } from '../models/search-result.model';
import axiosRetry from 'axios-retry';

axiosRetry(axios, {
  retries: 10,
  retryDelay: (retryCount) => {
    return retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response?.status === 503;
  },
});

export class TruyenFullPlugin implements NovelPlugin {
  id = 1;
  name = 'Truyện Full';
  url = 'https://truyenfull.vn/';

  init(): DynamicModule {
    return {
      module: TruyenFullPlugin,
      providers: [
        {
          provide: 'NovelPlugin',
          useClass: TruyenFullPlugin,
        },
      ],
      exports: ['NovelPlugin'],
    };
  }

  private readonly axiosConfig: AxiosRequestConfig = {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    },
  };

  private async fetchHtml(url: string): Promise<cheerio.CheerioAPI> {
    const response = await axios.get(url, this.axiosConfig);
    return cheerio.load(response.data);
  }

  async getDetails(name: string, page: number): Promise<Details> {
    const url = `https://truyenfull.vn/${name}${
      page > 1 ? `/trang-${page}/#list-chapter` : ''
    }`;
    console.log(url);
    const $ = await this.fetchHtml(url);

    const details = new Details();

    details.title = $('h3.title').text().trim();
    details.cover = $('.book img').attr('src') || '';
    details.author = $('a[itemprop="author"]').text().trim();
    details.source = $('.source').text().trim();
    details.status = $('.text-success').text().trim();
    $('div.col-info-desc a[itemprop="genre"]').each((index, element) => {
      const genreHref = $(element).attr('href') || '';
      let type = genreHref.split('/').slice(-2)[0] || '';
      type = '/novels/genres/' + type;

      const genreName = $(element).text().trim();

      if (genreName && type) {
        details.genres.push(new Genre(genreName, type));
      }
    });
    details.description = $('.desc-text.desc-text-full').html()?.trim() || '';
    details.maxPage = parseInt($('#total-page').val() as string, 10) || 1;
    $('.list-chapter li').each((index, element) => {
      const chapterElement = $(element).find('a');
      const chapterTitle = chapterElement.text().replace('Chương ', '').trim();
      const chapterLink = chapterElement.attr('href');
      // https://truyenfull.vn/tu-cam-270192/chuong-50/
      // /tu-cam-270192/50
      const parts = chapterLink?.split('/');
      const id = parts?.[3];
      const chapter = parts?.[4].replace('chuong-', '') || '';
      details.chapters.push(
        new Chapter(chapterTitle, `/novels/${id}/${chapter}`)
      );
    });
    return details;
  }

  async getAllChapter(name: string): Promise<Chapter[]> {
    const url = `https://truyenfull.vn/${name}`;
    const $ = await this.fetchHtml(url);

    const totalPages = parseInt($('#total-page').val() as string, 10) || 1;
    const chapters: Chapter[] = [];

    for (let i = 1; i <= totalPages; i++) {
      const pageUrl = `https://truyenfull.vn/${name}${
        i > 1 ? `/trang-${i}/#list-chapter` : ''
      }`;
      const $ = await this.fetchHtml(pageUrl);

      $('.list-chapter li').each((_, el) => {
        const chapter = new Chapter(
          $(el).find('a').text().replace('Chương ', '').trim(),
          $(el).find('a').attr('href')!
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
      '#chapter-c .ads-responsive, #chapter-c .bg-info, #chapter-c .box-notice, #chapter-c #ads-chapter-google-bottom, #chapter-c #chapter-end-bot, #chapter-c .text-center'
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
        ? `/novels/${id}/${Number(chapter) + 1}`
        : '';

    const chapters = await this.getAllChapter(id);
    chapterDetails.totalChapters = chapters.length;

    return chapterDetails;
  }

  async getHotNovels(page: number): Promise<NovelList> {
    const url = `https://truyenfull.vn/danh-sach/truyen-hot/${
      page > 1 ? `trang-${page}/` : ''
    }`;
    const $ = await this.fetchHtml(url);
    const hotNovels: Novel[] = [];

    $('.list.list-truyen.col-xs-12 .row').each((_, el) => {
      const cover =
        $(el).find('.lazyimg').data('image') ||
        $(el).find('.lazyimg').data('desk-image');
      if (!cover) return;

      const titleElement = $(el).find('.truyen-title a');
      const title = titleElement.text().trim();
      const titleLink = titleElement.attr('href');
      const parts1 = titleLink?.split('/');
      const titleId = '/novels/' + parts1?.slice(-2)[0];
      const id = titleLink?.split('/').slice(-2)[0];
      const author = $(el).find('.author').text().trim();
      const isFull = $(el).find('.label-title.label-full').length > 0;
      const isHot = $(el).find('.label-title.label-hot').length > 0;
      const chapterElement = $(el).find('.col-xs-2.text-info a');
      const chapter = chapterElement.text().replace('Chương ', '').trim();
      const chapterLink = chapterElement.attr('href');
      const parts = chapterLink?.split('/');
      const link =
        '/novels/' + parts?.[3] + '/' + parts?.[4].replace('chuong-', '');

      hotNovels.push(
        new Novel(
          id || '',
          cover.toString(),
          title,
          titleId,
          isFull,
          isHot,
          author,
          chapter,
          link
        )
      );
    });

    const lastPageLink = $('a:contains("Cuối")').attr('href');
    const totalPageMatch = lastPageLink?.match(/trang-(\d+)\//);
    const totalPages = totalPageMatch ? parseInt(totalPageMatch[1], 10) : 1;

    return new NovelList(hotNovels, totalPages, page);
  }

  async searchNovels(keyword: string, page: number): Promise<NovelList> {
    const url = `https://truyenfull.vn/tim-kiem/?tukhoa=${keyword}${
      page > 1 ? `&page=${page}` : ''
    }`;
    const $ = await this.fetchHtml(url);
    const searchResults: SearchResult[] = [];

    $('.list.list-truyen.col-xs-12 .row').each((_: any, el: any) => {
      const cover =
        $(el).find('.lazyimg').data('image') ||
        $(el).find('.lazyimg').data('desk-image');
      if (!cover) return;

      const titleElement = $(el).find('.truyen-title a');
      const title = titleElement.text().trim();
      const titleLink = titleElement.attr('href');
      const parts1 = titleLink?.split('/');
      const titleId = '/novels/' + parts1?.slice(-2)[0];

      const id = titleLink?.split('/').slice(-2)[0];
      const author = $(el).find('.author').text().trim();
      const isFull = $(el).find('.label-title.label-full').length > 0;
      const isHot = $(el).find('.label-title.label-hot').length > 0;
      const chapterElement = $(el).find('.col-xs-2.text-info a');
      const chapter = chapterElement.text().replace('Chương ', '').trim();
      const chapterLink = chapterElement.attr('href');
      const parts = chapterLink?.split('/');
      const link =
        '/novels/' + parts?.[3] + '/' + parts?.[4].replace('chuong-', '');

      searchResults.push(
        new SearchResult(
          id || '',
          cover.toString(),
          title,
          titleId,
          isFull,
          isHot,
          author,
          chapter,
          link
        )
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
        let type = href?.split('/').slice(-2)[0];
        type = '/novels/genres/' + type;
        const name = $(el).text().trim();
        genres.push(new Genre(name, type!));
      });

    return genres;
  }

  async getNovelsByGenre(genre: string, page: number): Promise<NovelList> {
    const url = `https://truyenfull.vn/the-loai/${genre}${
      page > 1 ? `/trang-${page}` : ''
    }`;
    const $ = await this.fetchHtml(url);
    const novels: Novel[] = [];

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
      const parts1 = titleLink?.split('/');
      const titleId = '/novels/' + parts1?.slice(-2)[0];
      const id = titleLink?.split('/').slice(-2)[0];
      const author = $(el).find('.author').text().trim();
      const isFull = $(el).find('.label-title.label-full').length > 0;
      const isHot = $(el).find('.label-title.label-hot').length > 0;
      const chapterElement = $(el).find('.col-xs-2.text-info a');
      const chapter = chapterElement.text().replace('Chương ', '').trim();
      const chapterLink = chapterElement.attr('href');
      const parts = chapterLink?.split('/');
      const link =
        '/novels/' + parts?.[3] + '/' + parts?.[4].replace('chuong-', '');

      novels.push(
        new Novel(
          id!,
          cover.toString(),
          title,
          titleId,
          isFull,
          isHot,
          author,
          chapter,
          link
        )
      );
    });

    return new NovelList(novels, totalPages, page);
  }

  async getIdByTitleAndAuthor(title: string, author: string): Promise<any> {
    // search with keyword = title
    let result = await this.searchNovels(title, 1);
    const totalPage1 = result.totalPages;
    for (let i = 2; i <= totalPage1; i++) {
      const data = await this.searchNovels(title, i);
      result.novels.push(...data.novels);
    }

    const novel = result.novels.find(
      (novel) => novel.title === title && novel.author === author
    );

    if (novel) {
      return novel.id;
    }
  }
}

export default TruyenFullPlugin;
