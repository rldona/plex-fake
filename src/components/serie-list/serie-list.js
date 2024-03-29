import React, { Component } from 'react';

import MovieItem from '../movie-item/movie-item';

class SerieList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      serieList: [],
      type: 'shows',
      page: 0
    };
  }

  componentDidMount() {
    this.fetchSerieList();
  }

  fetchSerieList = () => {
    const {
      serieList,
      type,
      page
    } = this.state;

    fetch(`http://34.252.151.163:3000/media?type=${type}&page=${page}`)
      .then(response => response.json())
      .then(series => {
        this.setState(state => {
          const newList = serieList.concat(series);
          return {
            ...this.state,
            serieList: newList
          };
        });
      });
  }

  loadMoreMovies = () => {
    this.setState({ page: this.state.page + 1 }, () => this.fetchserieList());
  }

  render() {
    const { serieList } = this.state;

    if (serieList.length === 0) {
      return null;
    }

    return (
      <div>
        <div className="movie-list">
          {
            serieList.map((serie, i) => {
              return <MovieItem key={i} movie={serie} />;
            })
          }
        </div>
        <button className="load-more" onClick={() => this.loadMoreMovies()}>Cargar más <i className="fas arrow-right"></i></button>
      </div>
    );
  }
}

export default SerieList;
