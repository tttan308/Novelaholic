export const fetchGenres = async () => {
  try {
    const response = await fetch(`http://localhost:3001/novels/genres`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};
