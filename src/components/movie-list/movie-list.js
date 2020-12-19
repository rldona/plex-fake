import React, { Component } from 'react';

import MovieItem from '../movie-item/movie-item';
class MovieList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      movieList: [],
      type: 'movies',
      page: 2,
      size: 50
    };
  }

  componentDidMount() {
    this.fetchMovieList();
  }

  fetchMovieList = () => {
    const {
      movieList,
      type,
      page,
      size
    } = this.state;

    fetch(`http://34.252.151.163:3000/media?type=${type}&page=${page}&limit=${size}`)
      .then(response => response.json())
      .then(movies => {
        this.setState(state => {
          const newList = movieList.concat(movies);
          return {
            ...state,
            movieList: newList
          };
        });
      });
  }

  loadMoreMovies = () => {
    this.setState({ page: this.state.page + 1 });
    this.fetchMovieList();
  }

  render() {
    const { movieList } = this.state;

    if (movieList.length === 0) {
      return null;
    }

    return (
      <div>
        <div className="movie-list">
          {
            movieList.map((movie, i) => {
              return <MovieItem key={i} movie={movie} />;
            })
          }
        </div>
        <button className="load-more" onClick={() => this.loadMoreMovies()}>Cargar más <i className="fas fa-arrow-right"></i></button>
      </div>
    );
  }
}

export default MovieList;
