import {
  getFullBookContent,
  getUpdateBook,
  getNovelInfo,
  getBookContent,
} from "./content";

const apiURL = process.env.REACT_APP_API_URL;

//book history
export const saveBookHistory = async (bookId, chapterNumber, sourceId) => {
  try {
    // Get the history from local storage or initialize an empty array if not present
    let history = JSON.parse(localStorage.getItem("history")) || [];

    console.log("Save book history: ", bookId, chapterNumber, sourceId);

    // Find the book in the history if item.sourceNovelIds includes an object having chapterId == bookId and sourceId == sourceId
    let book = history.find(item => 
      item.souceNovelIds.some(id => 
        id.chapterId === bookId
      )
    );


    if (book) {
      // Check if the chapter is already in the book's chapters list
      if (book.chapters.includes(chapterNumber)) {
        console.log("Chapter already exists in the book history");
        //delete the chapter from the list
        book.chapters = book.chapters.filter((item) => item !== chapterNumber);
      }

      // Add the new chapter number
      book.chapters.push(chapterNumber);
      book.lastRead = new Date().toISOString();

      // Remove the old entry and add the updated book at the beginning
      history = history.filter(item => 
        !item.souceNovelIds.some(id => 
            id.chapterId === bookId
        )
      );
      history.unshift(book);
    } else {
      // Fetch book details from the API
      const data = await getNovelInfo(bookId, sourceId);

      if (!data) {
        alert("Không tìm thấy sách");
        return;
      }


      // Create a new book entry
      book = {
        title: data.title,
        cover: data.cover,
        souceNovelIds: data.sourceNovelIds,
        sourceId: sourceId,
        chapters: [chapterNumber],
        lastRead: new Date().toISOString(),
      };
      history.unshift(book);
    }

    // Update local storage with the new history
    localStorage.setItem("history", JSON.stringify(history));
  } catch (error) {
    console.error("Error saving book history:", error);
  }
};

export const getBookHistory = () => {
  return JSON.parse(localStorage.getItem("history")) || [];
};

export const getFiveRecentBooks = () => {
  const history = getBookHistory();
  return history.slice(0, 5);
};

export const getBookHistoryChapter = (bookId) => {
  const history = getBookHistory();
  let book = history.find(item => 
    item.souceNovelIds.some(id => 
      id.chapterId === bookId
    )
  );
  return book ? book.chapters : [];
};

export const downloadBook = async (
  bookId,
  chapterFrom,
  chapterTo,
  sourceId
) => {
  console.log("Download book: ", bookId, sourceId);
  //save to indexedDB
  const book = await getBookContent(bookId, sourceId, chapterFrom, chapterTo);
  console.log("Downloaded book: ", book);
  if (!book) {
    return;
  }
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

    // Kiểm tra xem có tồn tại sách với bookId không
    const getRequest = objectStore.get(book.id);

    getRequest.onsuccess = () => {
      const existingBook = getRequest.result;

      if (existingBook) {
        // Nếu sách tồn tại, append chapters và chaptersContent
        const updatedChapters = [
          ...existingBook.chapters,
          ...book.chapters,
        ].reduce((acc, chapter) => {
          if (!acc.find((ch) => ch.number === chapter.number)) {
            acc.push(chapter);
          }
          return acc;
        }, []);

        const updatedChaptersContent = [
          ...existingBook.chaptersContent,
          ...book.chaptersContent,
        ].reduce((acc, chapterContent) => {
          if (
            !acc.find((ch) => ch.number === chapterContent.number)
          ) {
            acc.push(chapterContent);
          }
          return acc;
        }, []);

        const updatedBook = {
          ...existingBook,
          chapters: updatedChapters,
          chaptersContent: updatedChaptersContent,
        };

        objectStore.put(updatedBook);
      } else {
        // Nếu sách không tồn tại, thêm sách mới
        objectStore.add(book);
      }
      alert("Tải truyện thành công");
    };

    getRequest.onerror = () => {
      console.error("Error retrieving book:", getRequest.error);
    };
  };
  request.onerror = (event) => {
    console.error("Error downloading book: ", event.target.errorCode);
  };
};

//download books to indexedDB
export const downloadFullBook = async (
  bookId,
  chapterFrom,
  chapterTo,
  sourceId
) => {
  console.log("Download book: ", bookId, sourceId);
  //save to indexedDB
  const book = await getFullBookContent(bookId, sourceId);
  console.log("Downloaded book: ", book);
  if (!book) {
    return;
  }
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
  request.onerror = (event) => {
    console.error("Error downloading book: ", event.target.errorCode);
  };
};

export const isFullDownloaded = async (novel) => {
  const fetchNovel = await getNovelInfo(novel.id);
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
        return {
          id: book.id,
          title: book.title,
          cover: book.cover,
          sourceId: book.sourceId,
          chapterCount: book.chapters.length,
          sourceNovelIds: book.sourceNovelIds,  
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
     // Sử dụng con trỏ để duyệt qua tất cả các đối tượng
     const request = objectStore.openCursor();
 
     // Chuyển request thành promise
     const requestToPromise = (request) => {
      return new Promise((resolve, reject) => {
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };
        request.onerror = (event) => {
          reject(event.target.error);
        };
      });
    };

    let cursor = await requestToPromise(request);

    while (cursor) {
      if (cursor.value.sourceNovelIds) {
        console.log(cursor.value.sourceNovelIds);
        const found = cursor.value.sourceNovelIds.some(item => item.chapterId === bookId);
        if (found) {
          delete cursor.value.chaptersContent;  // Xóa thuộc tính chaptersContent nếu có
          return cursor.value;
        }
      }
      cursor.continue();
      cursor = await requestToPromise(request);
    }

    console.log("No objects found");
    return null;

  } catch (error) {
    console.log("Get obj info failed: ", error);
    return null;
  }
};

export const getDownloadedBookChapter = async (bookId, chapter) => {
  try {
    const db = await initIndexedDB();
    const transaction = db.transaction("books", "readonly");
    const objectStore = transaction.objectStore("books");

    // Sử dụng openCursor để duyệt qua tất cả các đối tượng trong objectStore
    const request = objectStore.openCursor();
    
    // Chuyển request thành Promise
    const requestToPromise = (request) => {
      return new Promise((resolve, reject) => {
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };
        request.onerror = (event) => {
          reject(event.target.error);
        };
      });
    };

    let cursor = await requestToPromise(request);

    while (cursor) {
      const book = cursor.value;

      if (book && book.sourceNovelIds) {
        const found = book.sourceNovelIds.some(item => item.chapterId === bookId);

        if (found && book.chaptersContent && book.chapters) {
          const index = book.chapters.findIndex((ch) => ch.number === parseInt(chapter));

          if (index !== -1) {
            const chapterContent = book.chaptersContent[index];
            return {
              ...chapterContent,
              chapterCount: book.chapterCount,
              chapters: book.chapters,
            };
          } else {
            console.log("Chapter not found");
            return null;
          }
        }
      }

      cursor = await requestToPromise(cursor.continue());
    }

    console.log("Book not found");
    return null;

  } catch (error) {
    console.error("Failed to retrieve the book:", error);
    return null;
  }
};


// Function to initialize the IndexedDB
const initIndexedDB = () => {
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
        db.createObjectStore("books", { keyPath: "id" });
      }
    };
  });
};

// Function to convert IndexedDB request to Promise
const requestToPromise = (request) => {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};


export const getSourcesFromLocalStorage = () => {
  const sources = localStorage.getItem("sources");
  return sources ? JSON.parse(sources) : [];
};
