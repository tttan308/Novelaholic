import { sourceQuery } from "./sourceQuery";

const apiURL = process.env.REACT_APP_API_URL;

export const fetchGenres = async () => {
  try {
    const response = await fetch(`${apiURL}/novels/genres` + sourceQuery(0));
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};
