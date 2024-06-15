import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL;

export const getChapter = async (id, chapter, source, retries = 3) => {
  console.log("Get chapter: ", id, chapter, source);
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(`${apiURL}/novels/${id}/${chapter}?id=${source}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(
        `Attempt ${attempt} to fetch chapter ${chapter} failed: `,
        error
      );
      if (attempt === retries) {
        throw new Error(
          `Fetch chapter ${chapter} failed after ${retries} attempts: ${error.message}`
        );
      }
      // Optionally, add a delay before retrying
      await new Promise((resolve) => setTimeout(resolve, 2000)); // wait 2 second before retrying
    }
  }
};

export const getFullBookContent = async (id, downSourceId) => {
  console.log("Get full book content: ", id, downSourceId);
  try {
    console.log(`${apiURL}/novels?id=${downSourceId}&name=${id}&page=1`);
    const novelInfo = await axios.get(
      `${apiURL}/novels?id=${downSourceId}&name=${id}&page=1`
    );

    const novelPromises = [];
    for (let i = 0; i < novelInfo.data.maxPage; i++) {
      novelPromises.push(
        axios
          .get(`${apiURL}/novels?id=${downSourceId}&name=${id}&page=${i + 1}`)
          .then(async (res) => {
            const chapterPromises = res.data.chapters.map((chapter, index) =>
              getChapter(id, i * 50 + index + 1, downSourceId)
            );
            return await Promise.all(chapterPromises);
          })
      );
    }

    const chaptersContent = (await Promise.all(novelPromises)).flat();
    const chapters = chaptersContent.map((content, index) => {
      return {
        title: content.chapterTitle,
        link: `/novels/${id}/${index + 1}`,
      };
    });

    return {
      id,
      ...novelInfo.data,
      chapters,
      chaptersContent,
    };
  } catch (error) {
    console.error("Error fetching book data at chapter:", error);
    alert("Error fetching book data: ", error.message);
  }
};

export const getBookContent = async (id, source, from, to) => {
  try {
    const novelInfo = await axios.get(
      `${apiURL}/novels?id=${source}&name=${id}&page=1`
    );

    const novelPromises = [];
    for (let i = from; i <= to; i++) {
      novelPromises.push(getChapter(id, i, source));
    }

    const chaptersContent = await Promise.all(novelPromises);
    const chapters = chaptersContent.map((content, index) => {
      return {
        number: parseInt(
          content.chapterTitle.substr(6, content.chapterTitle.indexOf(":"))
        ),
        title: content.chapterTitle,
        link: `/novels/${id}/${index + 1}`,
      };
    });

    const chapterCount = await getChapterCount(id);

    return {
      id,
      ...novelInfo.data,
      chapters,
      chapterCount,
      chaptersContent,
    };
  } catch (error) {
    console.error("Error fetching book data at chapter:", error);
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
    alert("Get chapter failed: ", error.message);
  }
};

export const getNovelInfo = async (id, sourceId, page = 1) => {
  try {
    const response = await axios.get(
      `${apiURL}/novels?id=${sourceId}&name=${id}&page=${page}`
    );
    return response.data;
  } catch (error) {
    console.log("Get novel info failed: ", error);
    alert("Get novel info failed: ", error.message);
  }
};

export const getChapterCount = async (id, sourceId) => {
  try {
    const response = await axios.get(`${apiURL}/novels?id=${sourceId}&name=${id}&page=1`);
    const maxPage = response.data.maxPage;

    const res2 = await axios.get(
      `${apiURL}/novels?id=${sourceId}&name=${id}&page=${maxPage}`
    );
    console.log(`sadasd sa: ${apiURL}/novels?id=${sourceId}&name=${id}&page=${maxPage}`)

    const last = res2.data.chapters[res2.data.chapters.length - 1].title;
    const res = parseInt(last.substr(6, last.indexOf(":")));
    if (res) {
      return res;
    } else {
      return parseInt(last.substr(6, last.indexOf(":")));
    }
  } catch (error) {
    console.log("Get chapter count failed: ", error);
    alert("Get chapter count failed: ", error.message);
  }
};

export const getSources = async () => {
  try {
    const response = await axios.get(`${apiURL}/sources`);
    const sources = response.data;
    return sources;
  } catch (error) {
    console.log("Get sources failed: ", error);
    return [];
  }
};

export const getSourceChapterIds = async (chapter, sources) => {
  try {
    const url = `${apiURL}/novels/getIdByTitleAndAuthor`;
    const bodies = sources.map((source) => ({
      title: chapter.title,
      author: chapter.author,
      id: source.id,
    }));

    const responsePromise = bodies.map((body) => axios.post(url, body));


    const responses = await Promise.all(responsePromise);

    const sourceChapterIds = sources.map((source, index) => {
      return {
        ...source,
        chapterId: responses[index].data,
      };
    });
    
    //remove sources that don't have the chapter
    sourceChapterIds.filter((source) => source.chapterId.length > 0);

    return sourceChapterIds.filter((source) => source.chapterId.length > 0);
  } catch (error) {
    console.log("Get chapter id failed: ", error);
    return -1;
  }
};
