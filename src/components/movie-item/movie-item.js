import React, { Component } from 'react';

import { withRouter } from 'react-router-dom'

class MovieItem extends Component {
  navigateTo(id) {
    const { history, movie } = this.props;
    history.push({ pathname:`/movie-detail/${id}`, state: { movie: movie } });
  }

  render() {
    const { movie } = this.props;

    if (!movie) return null;

    return (
      <div className={`item ${parseInt(movie.ratingAvergae) >= 5 ? (parseInt(movie.ratingAvergae) >= 6 ? 'positiva' : 'neutral') : 'negativa'} ${movie.viewCount ? 'viewed' : ''}`} onClick={() => this.navigateTo(movie._id)}>
        <img src={movie.thumbnail} alt={movie.title} />
        <ul>
          <li>{movie.ratingAvergae}</li>
          <li>{movie.ratingCount}</li>
        </ul>
        <h2>{movie.title}</h2>
      </div>
    );
  }
}

export default withRouter(MovieItem);
