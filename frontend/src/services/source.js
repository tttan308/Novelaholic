const apiURL = process.env.REACT_APP_API_URL;

export const fetchSources = async () => {
  try {
    const response = await fetch(`${apiURL}/sources`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};
