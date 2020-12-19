import React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import './App.css';

import MovieList from './components/movie-list/movie-list';
import SerieList from './components/serie-list/serie-list';
import MovieDetail from './components/movie-detail/movie-detail';

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/movie-list">Movies</Link>
          </li>
          <li>
            <Link to="/show-list">Shows</Link>
          </li>
        </ul>
      </nav>
      <Switch>
        <Route exact path="/">
          <MovieList />
        </Route>
        <Route exact path="/movie-list">
          <MovieList />
        </Route>
        <Route exact path="/show-list">
          <SerieList />
        </Route>
        <Route path="/movie-detail/:id">
          <MovieDetail />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
