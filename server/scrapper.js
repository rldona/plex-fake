const mongoose = require('mongoose');
const puppeteer = require('puppeteer');
const mongodb = require('./utils/mongodb');
const utils = require('./utils/utils');

var cron = require('node-cron');

let media = {
  'movie': {
    'data': []
  },
  'show': {
    'data': []
  }
};

async function getReview (moviePlexInfo) {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  const searchTerm = moviePlexInfo.title;

  await page.goto('https://www.filmaffinity.com/es/main.html', { waitUntil: 'networkidle2', timeout: 0 });

  await page.waitFor('.qc-cmp2-summary-buttons');
  await page.click('button.sc-ifAKCX.ljEJIv')

  await page.waitFor('#top-search-input');
  await page.$eval('#top-search-input', (el, searchTerm) => el.value = searchTerm, searchTerm);
  await page.click('input[type="submit"]');

  if (page.url().search('search') === -1) {
    await getMovieReviewFromDetail(browser, page, moviePlexInfo);
  } else if (page.url().search('advsearch') !== -1) {
    await getMovieReviewFromAdvancedSearch(browser, page, moviePlexInfo);
  } else {
    await getMovieReviewFromSearch(browser, page, moviePlexInfo);
  }
}

async function getMovieReviewFromDetail(browser, page, moviePlexInfo, urlSearchPage) {
  if (typeof urlSearchPage !== 'undefined') {
    await page.goto(urlSearchPage, { waitUntil: 'networkidle2', timeout: 0 });
  }

  await page.waitForSelector('#mt-content-cell');

  const review = await utils.evaluateFilmaffinityPage(page, moviePlexInfo);

  media[review.type].data.push(review);

  console.log(`Movies: ${media['movie'].data.length}`);
  console.log(`Series: ${media['show'].data.length}`);

  // mongodb.insert(review);

  await browser.close();
}

async function getMovieReviewFromSearch(browser, page, moviePlexInfo) {
  await page.waitForSelector('.z-search');

  const urlSearchPage = await page.evaluate(() => {
    return document.querySelector('.z-search > .se-it .mc-poster > a[href]').outerHTML.split('"')[3].toString();
  });

  await getMovieReviewFromDetail(browser, page, moviePlexInfo, urlSearchPage);
}

async function getMovieReviewFromAdvancedSearch(browser, page) {
  await browser.close();
}

async function createReview(type) {
  const mediaListJSON = await utils.convertXMLtoJSON(type);

  for (let i = 1; i < mediaListJSON.elements[0].elements.length; i++) {
    let movieInfo = mediaListJSON.elements[0].elements[i];
    let movieInfoFiltered = await utils.filterMediaPlexInfo(movieInfo);
    await getReview(movieInfoFiltered);
  }
}

async function initByType (url, type) {
  await utils.writeXMLtoJSON(url, type);
  await createReview(type);
  await utils.convertReviewListToJOSON(media[type], type);
}

exports.init = async () => {
  const sizeList = 1500;

  const moviesUrl = `https://195-154-178-71.06e267a88a7d4be5991af2a36c663e4b.plex.direct:32400/library/sections/9/all?type=1&sort=originallyAvailableAt%3Adesc&includeCollections=1&includeAdvanced=1&includeMeta=1&X-Plex-Container-Start=0&X-Plex-Container-Size=${sizeList}&X-Plex-Product=Plex%20Web&X-Plex-Version=4.48.1&X-Plex-Client-Identifier=bub8wo7yvridyyyu9buwda45&X-Plex-Platform=Chrome&X-Plex-Platform-Version=87.0&X-Plex-Sync-Version=2&X-Plex-Features=external-media%2Cindirect-media&X-Plex-Model=hosted&X-Plex-Device=OSX&X-Plex-Device-Name=Chrome&X-Plex-Device-Screen-Resolution=1685x1306%2C2560x1440&X-Plex-Token=H2oihB3g2ZUzUHXyXx-V&X-Plex-Language=es&X-Plex-Drm=widevine&X-Plex-Text-Format=plain&X-Plex-Provider-Version=1.3`;
  const seriesUrl = `https://195-154-185-117.1fa6c2d7e4d148db9e380a96583039ad.plex.direct:32400/library/sections/1/all?type=2&sort=originallyAvailableAt%3Adesc&includeCollections=1&includeAdvanced=1&includeMeta=1&X-Plex-Container-Start=0&X-Plex-Container-Size=${sizeList}&X-Plex-Product=Plex%20Web&X-Plex-Version=4.48.1&X-Plex-Client-Identifier=bub8wo7yvridyyyu9buwda45&X-Plex-Platform=Chrome&X-Plex-Platform-Version=87.0&X-Plex-Sync-Version=2&X-Plex-Features=external-media%2Cindirect-media&X-Plex-Model=hosted&X-Plex-Device=OSX&X-Plex-Device-Name=Chrome&X-Plex-Device-Screen-Resolution=1685x1306%2C2560x1440&X-Plex-Token=UdMoTNn42q9Uzxi-6EsR&X-Plex-Language=es&X-Plex-Drm=widevine&X-Plex-Text-Format=plain&X-Plex-Provider-Version=1.3`;

  // mongodb.resetCollection();

  // await mongodb.connect(TYPE);

  cron.schedule('0 0 * * *', async () => {
    console.log('Running this task every day at 00:00h');
    media.movie.data = [];
    media.show.data = [];
    await initByType(moviesUrl, 'movie');
    await initByType(seriesUrl, 'show');
  });

  // mongoose.connection.close();
}
