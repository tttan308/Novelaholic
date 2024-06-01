import Home from '../pages/Home';
import BookInfo from '../pages/BookInfo';
import BookContent from '../pages/BookContent';
import SearchPage from '../pages/SearchPage';
import GenrePage from '../pages/GenrePage';

const routes = [
  { path: '/', component: Home },
  { path: '/book/:id', component: BookInfo },
  { path: '/book/:id/:chapter', component: BookContent },
  { path: '/search', component: SearchPage },
  { path: '/category/:genre', component: GenrePage },
];

export default routes;
