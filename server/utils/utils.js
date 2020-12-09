const path = require('path');
const fetch = require('node-fetch');
const convert = require('xml-js');
const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);

exports.writeXMLtoJSON = async (url, type) => {
  let dataAsJson = {};

  return fetch(url)
  .then(response => response.text()).then(xml => {
    dataAsJson = JSON.parse(convert.xml2json(xml));
  }).then(() => {
    let data = JSON.stringify(dataAsJson);
    fs.writeFileSync(path.resolve(__dirname, '../plex-list/', `plex-${type}-list.json`), data);
  });
};

exports.convertXMLtoJSON = async (type) => {
  const mediaList = await readFileAsync(path.resolve(__dirname, '../plex-list/', `plex-${type}-list.json`));
  return JSON.parse(mediaList.toString('utf8'));
};

exports.filterMediaPlexInfo = async (movie) => {
  return {
    title: movie.attributes.title || movie.attributes.originalTitle,
    viewCount: parseInt(movie.attributes.viewCount) || 0,
    type: movie.attributes.type || 'movie',
    summary: movie.attributes.summary || '',
    duration: movie.attributes.duration || 90,
    studio: movie.attributes.studio || '',
    year: movie.attributes.year || 1990
  }
};

exports.evaluateFilmaffinityPage = async (page, media) => {
  const mediaReview = await page.evaluate(() => {
    const movieTitle = document.querySelector('h1 span') ? document.querySelector('h1 span').textContent : '';
    const reviewDescription = document.querySelector('[itemprop="description"]') ? document.querySelector('[itemprop="description"]').textContent : '';
    const reviewImage = document.querySelector('[itemprop="image"]') ? document.querySelector('[itemprop="image"]').outerHTML.split(' ')[4].replace('src="', '').replace('"', '') : '';
    const ratingAvergae = document.querySelector('#movie-rat-avg') ? document.querySelector('#movie-rat-avg').textContent.split('').filter(word => word !== ' ' && word !== '\n' && word !== ',').toString() : '0';
    const ratingCount = document.querySelector('#movie-count-rat > span') ? document.querySelector('#movie-count-rat > span').textContent : '0';

    const professionalReviewList = document.querySelectorAll('#pro-reviews li') || [];

    let reviewList = [];

    professionalReviewList.forEach(review => {
      let reviewBody = review.querySelector('[itemprop="reviewBody"]');
      let reviewAuthor = review.querySelector('.pro-crit-med');
      let reviewEvaluation = review.querySelector('.pro-crit-med > i');

      if (reviewBody && reviewAuthor) {
        reviewList.push({
          body: reviewBody.textContent,
          author: reviewAuthor.textContent,
          evaluation: reviewEvaluation.outerHTML.split(' ')[5].replace('"', '')
        });
      }
    });

    return {
      title: movieTitle,
      sinopsis: reviewDescription,
      thumbnail: reviewImage,
      ratingAvergae: ratingAvergae,
      ratingCount: ratingCount,
      reviewList
    }
  });

  mediaReview.title = media.title;
  mediaReview.viewCount = media.viewCount;
  mediaReview.type = media.type;
  mediaReview.duration = media.duration;
  mediaReview.studio = media.studio;

  return mediaReview;
}

exports.convertReviewListToJOSON = async (list, type) => {
  let jsonContent = JSON.stringify(list);
  fs.writeFileSync(path.resolve(__dirname, '../db/', `${type}-db.json`), jsonContent);
}
