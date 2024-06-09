import axios from 'axios';
const apiURL = process.env.REACT_APP_API_URL;

export const getChapter = async (id, chapter, source) => {
  console.log('Get chapter: ', id, chapter, source);
  try {
    const response = await axios.get(
      `${apiURL}/novels/${id}/${chapter}?source=${source}`
    );
    console.log(`${apiURL}/novels/${id}/${chapter}?source=${source}`);
    return response.data;
  } catch (error) {
    console.log('Get chapter failed: ', error);
  }
};

export const getFullBookContent = async (id, downSource) => {
  console.log('Get full book content: ', id, downSource);
  try {
    const bookResponse = await axios.get(
      `${apiURL}/novels?sources=${downSource}&name=${id}&page=1`
    );
    const {
      title,
      cover,
      author,
      gneres,
      source,
      status,
      description,
      chapters,
    } = bookResponse.data;

    // const chapterPromises = [];
    // chapters.forEach(chapter => {
    //     chapterPromises.push(axios.get(`${apiURL}/book/${id}/${chapter}`));
    // });

    const chapterPromises = chapters.map((chapter, index) =>
      getChapter(id, index + 1, downSource)
    );

    const chaptersContent = await Promise.all(chapterPromises);

    return {
      id,
      title,
      cover,
      author,
      gneres,
      source,
      status,
      description,
      chapters,
      chaptersContent,
    };
  } catch (error) {
    console.error('Error fetching book data:', error);
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
    console.log('Get chapter failed: ', error);
  }
};

export const getNovelInfo = async (id) => {
  //TODO: get novel info from API
};