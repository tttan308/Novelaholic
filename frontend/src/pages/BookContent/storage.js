//book history
const saveBookHistory = async (bookId, chapter) => {
    let history = JSON.parse(localStorage.getItem("history")) || [];
    history = history.filter((item) => item.bookId !== bookId);
    history.unshift({ bookId, chapter });
    localStorage.setItem("history", JSON.stringify(history));
};

//get book history
const getBookHistory = () => {
    return JSON.parse(localStorage.getItem("history")) || [];
};

//donwloaded book
import { getBook } from "./fetchAPI";

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
