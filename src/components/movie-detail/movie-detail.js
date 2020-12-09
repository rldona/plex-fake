import React, { Component } from 'react';

import { withRouter } from 'react-router-dom'

class MovieDetail extends Component {
  render() {
    const { location: { state: { movie } } } = this.props;

    if (!movie) return null;

    var divStyle = {
      backgroundImage: 'url(' + movie.thumbnail + ')'
    };

    return (
      <div className="movie-detail">
        <div className="thunbnail" style={divStyle}></div>
        <ul className="rating">
          <li className={`${parseInt(movie.ratingAvergae) >= 5 ? (parseInt(movie.ratingAvergae) >= 6 ? 'positiva' : 'neutral') : 'negativa'}`}>{movie.ratingAvergae}</li>
          <li>{movie.ratingCount}</li>
        </ul>
        <h2>{movie.title}</h2>
        <p>{movie.sinopsis}</p>
        <h3>Criticas profesionales:</h3>
        <div className="review-list">
          {
            movie.reviewList.map((review, i) => {
              return (
                <div className={`review-item ${review.evaluation}`} key={i}>
                  <p className="body">{review.body}</p>
                  <p>({review.author})</p>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

export default withRouter(MovieDetail);
