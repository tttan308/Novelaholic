import { getBook } from "./fetchAPI";


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

//donwloaded book

const downloadBook = async (bookId) => {
    //save to indexedDB
    const book = await getBook(bookId);
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

const downloadChapters = async (bookId, chapters) => {
    const request = indexedDB.open("books", 1);
    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("books", "readwrite");
        const objectStore = transaction.objectStore("books");
        const request = objectStore.get(bookId);
        request.onsuccess = (event) => {
            const book = event.target.result;
            book.chapters = chapters;
            objectStore.put(book);
        };
    };
}

const getDownloadedBooks = async () => {
    const request = indexedDB.open("books", 1);
    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("books", "readonly");
        const objectStore = transaction.objectStore("books");
        const request = objectStore.getAll();
        request.onsuccess = (event) => {
            console.log(event.target.result);
        };
    };
};

const getDownloadedBook = async (bookId) => {
    const request = indexedDB.open("books", 1);
    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("books", "readonly");
        const objectStore = transaction.objectStore("books");
        const request = objectStore.get(bookId);
        request.onsuccess = (event) => {
            console.log(event.target.result);
        };
    };
};

const deleteDownloadedBook = async (bookId) => {
    const request = indexedDB.open("books", 1);
    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("books", "readwrite");
        const objectStore = transaction.objectStore("books");
        objectStore.delete(bookId);
    };
}
