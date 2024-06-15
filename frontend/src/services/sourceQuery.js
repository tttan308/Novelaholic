export const sourceQuery = (type) => {
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  const urlParams = new URLSearchParams(url.search);
  const sourceParam = urlParams.get("source");

  if (sourceParam) {
    if (type === 0) {
      return `?id=${sourceParam}`;
    } else {
      return `&id=${sourceParam}`;
    }
  }
};
