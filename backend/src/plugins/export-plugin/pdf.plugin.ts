import { DynamicModule } from '@nestjs/common';
import { ExportFilePlugin } from './export-plugin.interface';
import { ExportFileDto } from 'src/dtos/exportfile.dto';

export class PDFPlugin implements ExportFilePlugin {
	id: 1;

	type: 'pdf';

	init(): DynamicModule {
		return {
			module: PDFPlugin,
			providers: [
				{
					provide: 'ExportPlugin',
					useValue: PDFPlugin,
				},
			],
			exports: ['ExportPlugin'],
		};
	}

	export(exportFileDto: ExportFileDto): Promise<ExportFileDto> {
		// Export the file as a PDF
		return Promise.resolve(exportFileDto);
	}
}

export default PDFPlugin;
