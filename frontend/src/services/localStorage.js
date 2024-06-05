import { getFullBookContent,  getUpdateBook , getNovelInfo } from "./content";


//book history
export const saveBookHistory = async (bookId, chapterNumber) => {
    let history = JSON.parse(localStorage.getItem("history")) || [];

    let book = history.find((item) => item.bookId === bookId);
    if (book) {
        if(book.chapters.includes(chapterNumber)) return;
        book.chapters.push(chapterNumber);
        book.lastRead = new Date();

        history = history.filter((item) => item.bookId !== bookId);
        history.unshift(book);
    } else {
        
        const apiURL = process.env.REACT_APP_API_URL;
        const res = await fetch(`${apiURL}/novels?source=truyenfull&name=${bookId}&page=1`);
        const data = await res.json();
       
        book = {
            id: bookId,
            title: data.title,
            cover: data.cover,
            chapters: [chapterNumber],
            lastRead: new Date()
        };
        history.unshift(book);
    }

    localStorage.setItem("history", JSON.stringify(history));
};

export const getBookHistory = () => {
    return JSON.parse(localStorage.getItem("history")) || [];
};

export const getFiveRecentBooks = () => {
    const history = getBookHistory();
    return history.slice(0, 5);
};


//download books to indexedDB
export const downloadFullBook = async (bookId, source) => {
    console.log("Download book: ", bookId, source);
    //save to indexedDB
    const book = await getFullBookContent(bookId, source);
    console.log(book);
    const request = indexedDB.open("books", 1);
    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const objectStore = db.createObjectStore("books", { keyPath: "id" });
        objectStore.createIndex("id", "id", { unique: true });
    };
    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("books", "readwrite");
        const objectStore = transaction.objectStore("books");
        objectStore.add(book);
    };
};

export const isFullDownloaded = async (novel) => {
    const fetchNovel = await getNovelInfo(novel.id);
    return fetchNovel.chapters.length === novel.chapters.length;
}

export const isDownLoaded = async (novel) => {
    const request = indexedDB.open("books", 1);
    let isDownloaded = false;
    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("books", "readwrite");
        const objectStore = transaction.objectStore("books");
        const request = objectStore.get(novel.id);
        request.onsuccess = (event) => {
            if (event.target.result) {
                isDownloaded = true;
            }
        };
    };
    request.onerror = (event) => {
        return false;
    }
    return isDownloaded;
}


export const updateDownloadedNovel = async (oldBook, lastChap, source) => {
    const updateBook = await getUpdateBook(oldBook, lastChap, source);
    const request = indexedDB.open("books", 1);
    
    //update oldBook in indexedDB
    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("books", "readwrite");
        const objectStore = transaction.objectStore("books");
        objectStore.put(updateBook);
    };
}

export const getDownloadedBookCardInfo = async () => {
    //get {id, title, corver, chapters.length} from indexedDB
    const request = indexedDB.open("books", 1);
    let books = [];
    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("books")) {
            db.createObjectStore("books", { keyPath: "id" });
        }
    };
    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("books", "readwrite");
        const objectStore = transaction.objectStore("books");
        const request = objectStore.getAll();
        request.onsuccess = (event) => {
            books = event.target.result.map(book => {
                return {
                    id: book.id,
                    title: book.title,
                    cover: book.cover,
                    chapters: book.chapters.length,
                };
            });
        };
    };
    //sort by lastRead
    return books;
}

export const getDownloadedBookInfo = async (bookId) => {
    //get {id,title,    cover,    author,    gneres,    source,    status,    description,    chapters } exclude chaptersContent from indexedDB
    const request = indexedDB.open("books", 1);
    let book = {};
    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("books", "readwrite");
        const objectStore = transaction.objectStore("books");
        const request = objectStore.get(bookId);
        request.onsuccess = (event) => {
            book = event.target.result;
            delete book.chaptersContent;
        };
    };
    return book; 
}

export const getDownloadedBookChapter = async (bookId, chapter) => {
    //get chapterContent from indexedDB
    const request = indexedDB.open("books", 1);
    let chapterContent = {};
    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("books", "readwrite");
        const objectStore = transaction.objectStore("books");
        const request = objectStore.get(bookId);
        request.onsuccess = (event) => {
            chapterContent = event.target.result.chaptersContent.find(chap => chap.chapter === chapter);
        };
    };
    return chapterContent;
}
