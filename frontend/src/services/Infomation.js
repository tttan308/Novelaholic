import { sourceQuery } from "./sourceQuery";

const apiURL = process.env.REACT_APP_API_URL;

export const getInfo = async (name, page) => {
  try {
    const response = await fetch(
      `${apiURL}/novels?name=${name}&page=${page}` + sourceQuery(1)
    );

    // console.log("url: ",`${apiURL}/novels?name=${name}&page=${page}` + sourceQuery(1));
    const info = await response.json();
    // console.log("fetch data:", info);

    return info;
  } catch (error) {
    console.log("FAILED: ", error);
    throw error;
  }
};

export const getChapter = async (next) => {
  try {
    const response = await fetch(`${apiURL}` + next + sourceQuery(0));
    const json = await response.json();
    return json;
  } catch (error) {
    console.log("FAILED: ", error);
    throw error;
  }
};

export const getExportType = async () => {
  try {
    const response = await fetch(`${apiURL}/export`);
    const json = await response.json();
    return json;
  } catch (error) {
    console.log("FAILED: ", error);
    throw error;
  }
};
