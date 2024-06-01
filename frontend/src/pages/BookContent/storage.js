//book history
const saveBookHistory = async (bookId, chapter) => {
    let history = JSON.parse(localStorage.getItem("history")) || [];
    history = history.filter((item) => item.bookId !== bookId);
    history.unshift({ bookId, chapter });
    localStorage.setItem("history", JSON.stringify(history));
};

//get book history
//save book content

//donwloaded book
const downloadBook = async (bookId) => {
    let downloaded = JSON.parse(localStorage.getItem("downloaded")) || [];
    downloaded.push(bookId);
    localStorage.setItem("downloaded", JSON.stringify(downloaded));
};