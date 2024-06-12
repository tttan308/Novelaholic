import { DynamicModule } from '@nestjs/common';
import { ExportFileDto } from '../../dtos/exportfile.dto';

export interface ExportFilePlugin {
	id: number;
	type: string;
	init(): DynamicModule;
	export(exportFileDto: ExportFileDto): Promise<Buffer>;
}
