import { Module } from '@nestjs/common';
import { NovelService } from './novel.service';
import { NovelController } from './novel.controller';
import { PluginModule } from '../plugins/plugin.module';

@Module({
	imports: [PluginModule],
	providers: [NovelService],
	controllers: [NovelController],
})
export class NovelModule {}
