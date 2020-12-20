const puppeteer = require('puppeteer');
const utils = require('./utils/utils');
const admin = require("firebase-admin");

const mediaStart = 10;
const mediaEnd   = 10;

let contador = mediaStart;

const moviesUrl = `https://195-154-178-71.06e267a88a7d4be5991af2a36c663e4b.plex.direct:32400/library/sections/9/all?type=1&sort=titleSort&includeCollections=1&includeAdvanced=1&includeMeta=1&X-Plex-Container-Start=${mediaStart}&X-Plex-Container-Size=${mediaEnd}&X-Plex-Product=Plex%20Web&X-Plex-Version=4.49.2&X-Plex-Client-Identifier=o6gz0i8lr4gpu8bz7e9gkajg&X-Plex-Platform=Chrome&X-Plex-Platform-Version=87.0&X-Plex-Sync-Version=2&X-Plex-Features=external-media%2Cindirect-media&X-Plex-Model=hosted&X-Plex-Device=OSX&X-Plex-Device-Name=Chrome&X-Plex-Device-Screen-Resolution=1619x1305%2C2560x1440&X-Plex-Token=H2oihB3g2ZUzUHXyXx-V&X-Plex-Language=es&X-Plex-Drm=widevine&X-Plex-Text-Format=plain&X-Plex-Provider-Version=1.3`;
const seriesUrl = `https://195-154-185-117.1fa6c2d7e4d148db9e380a96583039ad.plex.direct:32400/library/sections/1/all?type=2&sort=titleSort&includeCollections=1&includeAdvanced=1&includeMeta=1&X-Plex-Container-Start=${mediaStart}&X-Plex-Container-Size=${mediaEnd}&X-Plex-Product=Plex%20Web&X-Plex-Version=4.49.2&X-Plex-Client-Identifier=o6gz0i8lr4gpu8bz7e9gkajg&X-Plex-Platform=Chrome&X-Plex-Platform-Version=87.0&X-Plex-Sync-Version=2&X-Plex-Features=external-media%2Cindirect-media&X-Plex-Model=hosted&X-Plex-Device=OSX&X-Plex-Device-Name=Chrome&X-Plex-Device-Screen-Resolution=1619x1305%2C2560x1440&X-Plex-Token=UdMoTNn42q9Uzxi-6EsR&X-Plex-Language=es&X-Plex-Drm=widevine&X-Plex-Text-Format=plain&X-Plex-Provider-Version=1.3`;

const moviesType = 'movie';
const showsType  = 'show';

const db = admin.firestore();

async function getReview (moviePlexInfo) {
  const width    = 1100;
  const height   = 2000;

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: {
      width: width,
      height: height
    }
  });

  const page       = await browser.newPage();
  const searchTerm = moviePlexInfo.title;

  await page.setViewport({
    width: width,
    height: height
  })

  await page.goto('https://www.filmaffinity.com/es/main.html', { waitUntil: 'networkidle2', timeout: 0 });
  await page.waitFor('.qc-cmp2-summary-buttons');
  await page.click('button.sc-ifAKCX.ljEJIv')
  await page.waitFor('#top-search-input');
  await page.$eval('#top-search-input', (el, searchTerm) => el.value = searchTerm, searchTerm);
  await page.click('input[type="submit"]');
  await page.waitForSelector('#main-content-table');

  console.log(`Page: ${page.url().search('search')}`);

  if (moviePlexInfo.title.indexOf("/") === -1) {
    if (page.url().search('search') === -1) {
      await getMovieReviewFromDetail(browser, page, moviePlexInfo);
    }

    if (page.url().search('search') === 32) {
      await getMovieReviewFromSearch(browser, page, moviePlexInfo);
    }

    if (page.url().search('search') === 35) {
      await page.waitForSelector('.gsc-webResult > .gs-webResult > .gsc-thumbnail-inside > .gs-title > .gs-title')
      await page.click('.gsc-webResult > .gs-webResult > .gsc-thumbnail-inside > .gs-title > .gs-title')
      await getMovieReviewFromDetail(browser, page, moviePlexInfo);
    }
  } else {
    await browser.close();
  }
}

async function getMovieReviewFromDetail(browser, page, moviePlexInfo) {
  await page.waitForSelector('.movie-disclaimer');

  const review = await utils.evaluateFilmaffinityPage(page, moviePlexInfo);
  console.log(`review.title: ${review.title} | review.title: ${review.title} | review.thumbnail: ${review.thumbnail} | contador: ${contador}`);

  db.collection(`${review.type}s`).doc(review.ratingKey).set(review);
  contador++;

  // newReview.get()
  //   .then(doc => {
  //     if (!doc.exists) {
  //       console.log('Nuevo encontrado y añadido a la base de datos');
  //       db.collection(`${review.type}s`).doc(review.ratingKey).set(review);
  //     } else {
  //       console.log('El documento ya está en la base de datos');
  //       process.exit();
  //     }
  //   })
  //   .catch(err => {
  //     console.log('Error getting document', err);
  //   });

  await browser.close();
}

async function getMovieReviewFromSearch(browser, page, moviePlexInfo) {
  await page.waitForSelector('#title-result > .z-search > .se-it:nth-child(2) > .fa-shadow-nb > .movie-card > .mc-info-container > .mc-title > a')
  await page.click('#title-result > .z-search > .se-it:nth-child(2) > .fa-shadow-nb > .movie-card > .mc-info-container > .mc-title > a')
  await getMovieReviewFromDetail(browser, page, moviePlexInfo);
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
}

async function initCronTab () {
  await initByType(moviesUrl, moviesType);
  // await initByType(seriesUrl, showsType);

  process.exit();
}

exports.init = async () => initCronTab();
