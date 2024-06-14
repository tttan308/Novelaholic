import { Injectable } from '@nestjs/common';
import { DynamicModule } from '@nestjs/common';
import { ExportFilePlugin } from './export-plugin.interface';
import { ExportFileDto } from 'src/dtos/exportfile.dto';
const JSZip = require('jszip');
const vnStr = require("vn-str");

@Injectable()
export class EPUBPlugin implements ExportFilePlugin {
	id = 2;
	type = 'epub';

	init(): DynamicModule {
		return {
			module: EPUBPlugin,
			providers: [
				{
					provide: 'ExportPlugin',
					useValue: EPUBPlugin,
				},
			],
			exports: ['ExportPlugin'],
		};
	}

	async export(exportFileDto: ExportFileDto): Promise<Buffer> {
		const { novelTitle, author, chapters } = exportFileDto;

		try {
			const zip = new JSZip();
			// Add mimetype file (required for EPUB)
			const mimetype = 'application/epub+zip';
			zip.file('mimetype', mimetype);
    

			const containerXml = `<?xml version="1.0"?>
      <container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
        <rootfiles>
          <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
        </rootfiles>
      </container>`;
			zip.folder('META-INF')?.file('container.xml', containerXml);

			const contentOpf = `<?xml version="1.0" encoding="UTF-8"?>
      <package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid">
        <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
          <dc:title>${novelTitle}</dc:title>
          <dc:creator>${author}</dc:creator>
          <dc:language>en</dc:language>
          <dc:identifier id="bookid">urn:uuid:${this.generateUUID()}</dc:identifier>
          <meta property="dcterms:modified">2000-03-24T00:00:00Z</meta>
        </metadata>
        <manifest>
          <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
          <item id="content" href="content.xhtml" media-type="application/xhtml+xml"/>
        </manifest>
        <spine toc="ncx">
          <itemref idref="content"/>
        </spine>
      </package>`;
			zip.folder('OEBPS')?.file('content.opf', contentOpf);

			var tocNcx = `<?xml version="1.0" encoding="UTF-8"?>
      <ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
        <head>
          <meta name="dtb:uid" content="urn:uuid:${this.generateUUID()}"/>
          <meta name="dtb:depth" content="1"/>
          <meta name="dtb:totalPageCount" content="0"/>
          <meta name="dtb:maxPageNumber" content="0"/>
        </head>
        <docTitle>
          <text>${novelTitle}</text>
        </docTitle>
        <navMap>
          <navPoint id="navPoint-1" playOrder="1">
            <navLabel>`;
            chapters.map((item, index) => {
              tocNcx += `<text> ${item.chapterTitle} </text>`;
            })            
        tocNcx +=`</navLabel>
            <content src="content.xhtml"/>
          </navPoint>
        </navMap>
      </ncx>`;
			zip.folder('OEBPS')?.file('toc.ncx', tocNcx);

			var contentXhtml = `<?xml version="1.0" encoding="UTF-8"?>
      <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>${novelTitle}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { text-align: center; }
          h2 { margin-top: 40px; }
          p { margin-top: 20px; line-height: 1.6; }
        </style>
      </head>
      <body>
      <h1>${novelTitle}</h1>`;
      chapters.map((item,index) => {
        contentXhtml += `<h2>${item.chapterTitle}</h2>
                         <p>${item.chapterContent
                          .replace(/<br>/g, "</p><p>")
                          .replace(/&nbsp/g, " ")}</p>`
      })
      contentXhtml += `</body>
                      </html>`;
			zip.folder('OEBPS')?.file('content.xhtml', contentXhtml);
			const buffer = await zip.generateAsync({ type: 'nodebuffer' });
			return buffer;
		} catch (error) {
			console.log(error);
			throw new Error('Error generating EPUB file');
		}
	}

	private generateUUID(): string {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
			/[xy]/g,
			function (c) {
				const r = (Math.random() * 16) | 0,
					v = c == 'x' ? r : (r & 0x3) | 0x8;
				return v.toString(16);
			},
		);
	}
}

export default EPUBPlugin;
