import Home from "../pages/Home";
import BookInfo from "../pages/BookInfo";
import BookContent from "../pages/BookContent";
import SearchPage from "../pages/SearchPage";

const routes = [
  { path: "/", component: Home },
  { path: "/bookInfo", component: BookInfo },
  { path: "/bookContent", component: BookContent },
  { path: "/search", component: SearchPage },
];

export default routes;
