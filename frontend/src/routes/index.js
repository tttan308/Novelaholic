import Home from "../pages/Home";
import BookInfo from "../pages/BookInfo";
import BookContent from "../pages/BookContent";
import SearchPage from "../pages/SearchPage";
import GenrePage from "../pages/GenrePage";
import DownloadedBookList from "../pages/DownloadedBookList";

const routes = [
  { path: "/", component: Home },
  { path: "/book/:id", component: BookInfo },
  { path: "/book/:id/:chapter", component: BookContent },
  { path: "/book/:id/:chapter/:sourceId", component: BookContent },
  { path: "/search", component: SearchPage },
  { path: "/category/:genre", component: GenrePage },
  { path: "/downloaded", component: DownloadedBookList },
  { path: "/downloaded/:id/:chapter", component: BookContent },
];

export default routes;
