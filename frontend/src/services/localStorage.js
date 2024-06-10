import { getFullBookContent, getUpdateBook, getNovelInfo } from "./content";

const apiURL = process.env.REACT_APP_API_URL;

//book history
export const saveBookHistory = async (bookId, chapterNumber) => {
    let history = JSON.parse(localStorage.getItem("history")) || [];

    let book = history.find((item) => item.bookId === bookId);
    if (book) {
        if (book.chapters.includes(chapterNumber)) return;
        book.chapters.push(chapterNumber);
        book.lastRead = new Date();

        history = history.filter((item) => item.bookId !== bookId);
        history.unshift(book);
    } else {
        const res = await fetch(`${apiURL}/novels?id=1&name=${bookId}&page=1`);
        const data = await res.json();

        book = {
            id: bookId,
            title: data.title,
            cover: data.cover,
            chapters: [chapterNumber],
            lastRead: new Date(),
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
export const downloadFullBook = async (bookId, source, setIsDownloading) => {
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
        setIsDownloading(false);
    };
    request.onerror = (event) => {
        console.error("Error downloading book: ", event.target.errorCode);
        setIsDownloading(false);
    };
};

export const isFullDownloaded = async (novel) => {
    const fetchNovel = await getNovelInfo(novel.id);
    console.log(`novel: ${novel.chapters.length}`);
    console.log(`fetchNovel: ${fetchNovel.chapters.length}  `);
    if (!novel.chapters || !fetchNovel.chapters) return false;
    return fetchNovel.chapters.length === novel.chapters.length;
};

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
    };
    return isDownloaded;
};

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
};

export const getDownloadedBookCardInfo = async () => {
    // Function to wrap an IndexedDB request in a promise
    function requestToPromise(request) {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Function to initialize the IndexedDB
    function initIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("books", 1);
            request.onerror = (event) => reject(event.target.errorCode);
            request.onsuccess = (event) => resolve(event.target.result);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains("books")) {
                    db.createObjectStore("books", { keyPath: "id" });
                }
            };
        });
    }

    try {
        const db = await initIndexedDB();
        const transaction = db.transaction("books", "readonly");
        const objectStore = transaction.objectStore("books");
        const request = objectStore.getAll();
        const books = await requestToPromise(request);

        const booksWithFullDownloadInfo = await Promise.all(
            books.map(async (book) => {
                const isFullDownload = await isFullDownloaded(book);
                return {
                    id: book.id,
                    title: book.title,
                    cover: book.cover,
                    chapterCount: book.chapters.length,
                    isFullDownload,
                };
            })
        );

        // Assuming there is a lastRead property in the book object to sort by
        booksWithFullDownloadInfo.sort(
            (a, b) => new Date(b.lastRead) - new Date(a.lastRead)
        );

        return booksWithFullDownloadInfo;
    } catch (error) {
        console.error("Failed to get book card info:", error);
        return [];
    }
};

export const getDownloadedBookInfo = async (bookId) => {
    //get {id,title,    cover,    author,    gneres,    source,    status,    description,    chapters } exclude chaptersContent from indexedDB
    function requestToPromise(request) {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Function to initialize the IndexedDB
    function initIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("books", 1);
            request.onerror = (event) => {
                reject(event.target.errorCode);
            };
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains("books")) {
                    db.createObjectStore("books", {
                        keyPath: "id",
                        autoIncrement: true,
                    });
                }
            };
        });
    }

    try {
        const db = await initIndexedDB();
        const transaction = db.transaction("books", "readonly");
        const objectStore = transaction.objectStore("books");
        const request = objectStore.get(bookId);
        const book = await requestToPromise(request);

        if (book) {
            delete book.chaptersContent;
            console.log("Get book info 3: ", book);
            return book;
        } else {
            console.log("Book not found");
            return null;
        }
    } catch (error) {
        console.log("Get book info failed: ", error);
        return null;
    }
};

export const getDownloadedBookChapter = async (bookId, chapter) => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("books", 1);

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction("books", "readonly");
            const objectStore = transaction.objectStore("books");
            const getRequest = objectStore.get(bookId);

            getRequest.onsuccess = (event) => {
                const book = event.target.result;
                if (book && book.chaptersContent) {
                    const chapterContent = book.chaptersContent[chapter - 1];
                    console.log("Chapter found: ", chapterContent);
                    resolve(chapterContent);
                } else {
                    console.log("Chapter not found");
                    resolve(null); // Return null if no content is found
                }
            };

            getRequest.onerror = (event) => {
                reject(new Error("Failed to retrieve the book"));
            };
        };

        request.onerror = (event) => {
            reject(new Error("Failed to open the database"));
        };
    });
};
