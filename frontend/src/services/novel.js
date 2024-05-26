export const fetchHotNovels = async (page) => {
  try {
    const response = await fetch(
      `http://localhost:3001/novels/hot?page=${page}`
    );
    const data = await response.json();
    return data.hotNovels;
  } catch (error) {
    console.error(error);
  }
};

export const searchNovels = async (keyword, page) => {
  try {
    const response = await fetch(
      `http://localhost:3001/novels/search?keyword=${keyword}&page=${page}`
    );
    const data = await response.json();
    return data.searchResults;
  } catch (error) {
    console.error(error);
  }
};
