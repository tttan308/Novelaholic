import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL;

export const getChapter = async (id, chapter, source) => {
    console.log("Get chapter: ", id, chapter, source);
    try {
        const response = await axios.get(
            `${apiURL}/novels/${id}/${chapter}?id=${source}`
        );
        // console.log(`${apiURL}/novels/${id}/${chapter}?id=${source}`);
        return response.data;
    } catch (error) {
        console.log("Get chapter failed: ", error);
    }
};

export const getFullBookContent = async (id, downSourceId) => {
    console.log("Get full book content: ", id, downSourceId);
    try {
        console.log(`${apiURL}/novels?id=${downSourceId}&name=${id}&page=1`);
        const bookResponse = await axios.get(
            `${apiURL}/novels?id=${downSourceId}&name=${id}&page=1`
        );
        const {
            title,
            cover,
            author,
            genres,
            source,
            status,
            description,
            chapters,
            maxPage,
        } = bookResponse.data;

        // const chapterPromises = [];
        // chapters.forEach(chapter => {
        //     chapterPromises.push(axios.get(`${apiURL}/book/${id}/${chapter}`));
        // });

        const chapterPromises = chapters.map((chapter, index) =>
            getChapter(id, index + 1, downSourceId)
        );

        const chaptersContent = await Promise.all(chapterPromises);

        return {
            id,
            title,
            cover,
            author,
            genres,
            source,
            status,
            description,
            chapters,
            chaptersContent,
            maxPage,
        };
    } catch (error) {
        console.error("Error fetching book data:", error);
        alert("Error fetching book data: ", error.message);
    }
};

export const getUpdateBook = async (oldBook, lastChap, source) => {
    try {
        const chapterPromises = [];
        for (let i = oldBook.chapters.lenth; i <= lastChap; i++) {
            chapterPromises.push(getChapter(oldBook.id, i, source));
        }

        const chaptersContent = await Promise.all(chapterPromises);

        return {
            ...oldBook,
            chapters: oldBook.chapters.concat([
                ...Array(lastChap - oldBook.chapters.length).keys(),
            ]),
            chaptersContent: oldBook.chaptersContent.concat(chaptersContent),
        };
    } catch (error) {
        console.log("Get chapter failed: ", error);
    }
};

export const getNovelInfo = async (id) => {
    try {
        const response = await axios.get(
            `${apiURL}/novels?id=1&name=${id}&page=1`
        );
        return response.data;
    } catch (error) {
        console.log("Get novel info failed: ", error);
    }
};

export const getSources = async () => {
    try {
        const response = await axios.get(`${apiURL}/sources`);
        return response.data;
    } catch (error) {
        console.log("Get sources failed: ", error);
        return [];
    }
};
