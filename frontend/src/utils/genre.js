export const getGenreFromHref = (href) => {
  const arr = href.split('/');

  return arr[arr.length - 2];
};
