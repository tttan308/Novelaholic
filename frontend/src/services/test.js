const apiURL = process.env.REACT_APP_API_URL;

const TestSources = async () => {
  const sources = JSON.parse(localStorage.getItem("sources"));

  for (let source of sources) {
    try {
      const response = await fetch(`${apiURL}/novels/genres?id=${source.id}`);
      const data = await response.json();

      if (data.statusCode !== 500) {
        return source.id;
      }
    } catch (error) {
      console.error(error);
    }
  }

  return null;
};

export default TestSources;
