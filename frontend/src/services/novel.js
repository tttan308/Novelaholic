const apiURL = process.env.REACT_APP_API_URL;

export const fetchHotNovels = async (page) => {
    try {
        const response = await fetch(`${apiURL}/novels/hot?page=${page}`);
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
            `${apiURL}/novels/search?keyword=${keyword}&page=${page}`
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

export const searchByGenre = async (genre, page) => {
    try {
        const response = await fetch(
            `${apiURL}/novels/genres/${genre}?page=${page}`
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
