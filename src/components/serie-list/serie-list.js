import React, { Component } from 'react';

import MovieItem from '../movie-item/movie-item';

class SerieList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      serieList: []
    };
  }

  componentDidMount() {
    this.fetchSerieList();
  }

  fetchSerieList = () => {
    const {
      serieList
    } = this.state;

    const type = 'series';

    fetch(`http://3.250.230.235:3000/${type}`)
      .then(response => response.json())
      .then(series => {
        this.setState(state => {
          const newList = serieList.concat(series.data);
          return {
            ...this.state,
            serieList: newList
          };
        });
      });
  }

  loadMoreMovies = () => {
    this.setState({ page: this.state.page + 1 });
    this.fetchserieList();
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
        <button className="load-more" onClick={() => this.loadMoreMovies()}>Cargar más...</button>
      </div>
    );
  }
}

export default SerieList;
