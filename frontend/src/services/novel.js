export const fetchHotNovels = async (page) => {
  try {
    const response = await fetch(
      `http://localhost:3001/novels/hot?page=${page}`
    );
    const data = await response.json();
    return {
      data: data.novels,
      total: data.totalPages,
      page: data.currentPage,
    };
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
    return {
      data: data.searchResults,
      total: data.totalPages,
      page: data.currentPage,
    };
  } catch (error) {
    console.error(error);
  }
};

export const searchByGenre = async (genre, page) => {
  try {
    const response = await fetch(
      `http://localhost:3001/novels/genres/${genre}?page=${page}`
    );
    const data = await response.json();
    console.log(data);
    return {
      data: data.novels,
      total: data.totalPages,
      page: data.currentPage,
    };
  } catch (error) {
    console.error(error);
  }
};
