import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL;

export const getChapter = async (id, chapter, source, retries = 3) => {
  console.log("Get chapter: ", id, chapter, source);
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(`${apiURL}/novels/${id}/${chapter}?id=${source}`);
      console.log(response.data);
      const chapterContent = response.data.chapterContent.replace(/\n\n\t/g, "<br><br>");
      return {
        ... response.data,
        chapterContent,
      };

    } catch (error) {
      console.log(
        `Attempt ${attempt} to fetch chapter ${chapter}, book ${id}, source ${source} failed: `,
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
      sourceId: downSourceId,
      chaptersContent,
    };
  } catch (error) {
    console.error("Error fetching book data at chapter:", error);
    alert("Error fetching book data: ", error.message);
  }
};

export const getSourcesFromLocalStorage = () => {
  const sources = localStorage.getItem("sources");
  if (sources) {
    return JSON.parse(sources);
  } else {
    return [];
  }
};


export const getBookContent = async (id, source, from, to) => {
  try {
    const novelInfo = await getNovelInfo(id, source);


    const novelPromises = [];
    for (let i = from; i <= to; i++) {
      novelPromises.push(getChapter(id, i, source));
    }
   
    const res = await Promise.all(novelPromises);
    const chaptersContent = res.map((content, index) => {
      return {
        number: parseInt(
          content.chapterTitle.substr(6, content.chapterTitle.indexOf(":"))
        ),
        ...content,
      };
    })
    
    const chapters = chaptersContent.map((content, index) => {
      return {
        number: content.number,
        title: content.chapterTitle,
        link: `/novels/${id}/${index + 1}`,
      };
    });

    const chapterCount = await getChapterCount(id, source);

    return {
      id: novelInfo.hashedId,
      ...novelInfo,
      chapters,
      chapterCount,
      sourceId: source,
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

export function removeChineseCharactersAndPunctuation(input) {

  //remove các ký tự từ dấu '-' trở về sau
  let result = input?.replace(/[-].*$/, "");
  
  console.log("Result: ", result);

  // Loại bỏ khoảng trắng ở đầu và cuối chuỗi nếu có
  return result.trim();
}

export const getNovelInfo = async (id, sourceId, page = 1) => {
  try {
    const response = await axios.get(
      `${apiURL}/novels?id=${sourceId}&name=${id}&page=${page}`
    );
    const novelInfo = response.data;
    const title = removeChineseCharactersAndPunctuation(novelInfo.title);

    

    const sources = await getSources();
    const sourceNovelIds = await getSourceChapterIds(novelInfo, sources);

    return {
      ...novelInfo,
      sourceNovelIds,
      title,
      
      hashedId: title,
    };

  } catch (error) {
    console.log("Get novel info failed: ", error);
    alert("Get novel info failed: ", error.message);
  }
};

export const getChapterCount = async (id, sourceId) => {
  try {
    console.log("Get chapter count: ", id, sourceId);
    const response = await axios.get(`${apiURL}/novels?id=${sourceId}&name=${id}&page=1`);
    const maxPage = response.data.maxPage;

    const res2 = await axios.get(
      `${apiURL}/novels?id=${sourceId}&name=${id}&page=${maxPage}`
    );

    const last = res2.data.chapters[res2.data.chapters.length - 1].title;
    const res = parseInt(last.substr(0, last.indexOf(":")));
    if (res) {
      return res;
    } else {
      return parseInt(last.substr(6, last.indexOf(":")));
    }
  } catch (error) {
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
    //if chapter.title has "Tự Cẩm"
    // if (chapter.title.includes("Tự Cẩm")) {
    //   chapter.title = chapter.title = "Tự Cẩm"
    // }


    const url = `${apiURL}/novels/getIdByTitleAndAuthor`;
    const bodies = sources.map((source) => ({
      title: chapter.title,
      author: chapter.author,
      id: source.id,
    }));

    const responsePromise = bodies.map((body) => axios.post(url, body));

    //log request
    console.log("Get chapter id request: ", bodies);

    const responses = await Promise.all(responsePromise);

    const sourceChapterIds = sources.map((source, index) => {
      return {
        ...source,
        chapterId: responses[index].data,
      };
    });
    console.log("Source chapter ids: ", sourceChapterIds);
    //remove sources that don't have the chapter
    sourceChapterIds.filter((source) => source.chapterId.length > 0);

    return sourceChapterIds.filter((source) => source.chapterId.length > 0);
  } catch (error) {
    console.log("Get chapter id failed: ", error);
    return -1;
  }
};
