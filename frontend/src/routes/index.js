import Home from '../pages/Home';
import BookInfo from '../pages/BookInfo';
import BookContent from '../pages/BookContent';
import SearchPage from '../pages/SearchPage';
import { Component } from 'react';

const routes = [
  { path: '/', component: Home },
  { path: '/book/:id', component: BookInfo },
  { path: '/book-content', component: BookContent },
  { path: '/search', component: SearchPage },
];

export default routes;
