import { Injectable, OnModuleInit } from '@nestjs/common';
import * as glob from 'glob';
import * as path from 'path';
import 'reflect-metadata';

@Injectable()
export class ImplementationScannerService implements OnModuleInit {
	async onModuleInit() {
		// const files = this.findFiles();
		// console.log('Files:', files);

		// const implementations = await this.findImplementations('ICrawl', files);
		// console.log('Classes implementing ICrawl:', implementations);
	}

	private findFiles(): string[] {
		const searchPath = path.join(
			__dirname,
			'../../../src/modules/crawl/truyenfull/truyenfull.service.ts',
		);
		console.log('Search Path:', searchPath);

		const files = glob.sync(searchPath, { absolute: true });
		console.log('Files found:', files);
		return files;
	}

	private async findImplementations(
		interfaceName: string,
		files: string[],
	): Promise<any[]> {
		const classes = [];

		for (const file of files) {
			const module = await import(file);

			for (const key in module) {
				const target = module[key];
				if (
					Reflect.getMetadata('implements:interface', target) === interfaceName
				) {
					classes.push(target);
				}
			}
		}

		return classes;
	}
}
