import { Module } from '@nestjs/common';
import { NovelService } from './novel.service';
import { NovelController } from './novel.controller';
import { CrawlModule } from '../crawl/crawl.module';

@Module({
	imports: [CrawlModule],
	providers: [NovelService],
	controllers: [NovelController],
})
export class NovelModule {}
