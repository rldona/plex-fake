import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';

class MovieItem extends Component {
  navigateTo(id) {
    const { history, movie } = this.props;
    history.push({ pathname:`/movie-detail/${id}`, state: { movie: movie } });
  }

  convertMinutesToHours = (n) => {
    const num = n / 60000;
    const hours = (num / 60);
    const rhours = Math.floor(hours);
    const minutes = (hours - rhours) * 60;
    const rminutes = Math.round(minutes);

    return `${rhours}h ${rminutes}m`;
  }

  render() {
    const { movie } = this.props;

    if (!movie) return null;

    return (
      <div className={`item ${parseInt(movie.ratingAvergae) >= 5 ? (parseInt(movie.ratingAvergae) >= 6 ? 'positiva' : 'neutral') : 'negativa'} ${movie.viewCount ? 'viewed' : ''}`} onClick={() => this.navigateTo(movie._id)}>
        <img src={movie.thumbnail} alt={movie.title} />
        { movie.ratingAvergae !== 0 ? <p className="rating-average"><i className="fas fa-heart"></i> {movie.ratingAvergae === '0' ? '-' : movie.ratingAvergae}</p> : null }
        <h2>{movie.title}</h2>
        <div className="info-extra">
          { movie.ratingCount !== 0 ? <p><i className="fas fa-eye"></i> {movie.ratingCount  === '0' ? '-' : movie.ratingCount}</p> : null }
          <p><i className="fas fa-clock"></i> {this.convertMinutesToHours(movie.duration)}</p>
        </div>
      </div>
    );
  }
}

export default withRouter(MovieItem);
