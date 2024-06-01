//API 
GET /book/:id/:chapter  { source: abc}  ==> {source, novelID, novelTitle, chapterTitle, chapterNumber, chapterCount, chapterContent}
GET /sources/:bookID                    ==> {source: [abc, xyz, 123]}       //lấy danh sách sources của một quyển sách nào đó
GET /book/:id                           ==> {source, novelID, novelTitle, chapterCount, description, coverImage, genres}