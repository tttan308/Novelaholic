//API 
GET /book/:id/:chapter/:source          ==> {source, novelID, novelTitle, chapterTitle, chapterNumber, chapterList, chapterContent}
GET /sources/:bookID                    ==> {source: [abc, xyz, 123]}       //lấy danh sách sources của một quyển sách nào đó
GET /book/:id                           ==> {source, novelID, novelTitle, chapterList, description, coverImage, genres}
GET /book?search=abc&genre=xyz&page=x   ==> {novels, page}        //có cache
GET /book/new                           ==> {novels}
GET /book/hot                           ==> {novels}
GET /book/download/pdf                  ==> {pdf file}


DbContext -> model
infrastructure -> DbContext
infrastructure -> Contract (repository, auth)
Contract - interface
Controller -> Contract