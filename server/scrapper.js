const puppeteer = require('puppeteer');
const utils = require('./utils/utils');
const admin = require("firebase-admin");

const movieStart = 0;
const movieEnd = 5206;

const moviesUrl = `https://195-154-178-71.06e267a88a7d4be5991af2a36c663e4b.plex.direct:32400/library/sections/9/all?type=1&sort=addedAt%3Adesc&includeCollections=1&includeAdvanced=1&includeMeta=1&X-Plex-Container-Start=${movieStart}&X-Plex-Container-Size=${movieEnd}&X-Plex-Product=Plex%20Web&X-Plex-Version=4.48.1&X-Plex-Client-Identifier=o6gz0i8lr4gpu8bz7e9gkajg&X-Plex-Platform=Chrome&X-Plex-Platform-Version=87.0&X-Plex-Sync-Version=2&X-Plex-Features=external-media%2Cindirect-media&X-Plex-Model=hosted&X-Plex-Device=OSX&X-Plex-Device-Name=Chrome&X-Plex-Device-Screen-Resolution=1784x1306%2C2560x1440&X-Plex-Token=H2oihB3g2ZUzUHXyXx-V&X-Plex-Language=es&X-Plex-Drm=widevine&X-Plex-Text-Format=plain&X-Plex-Provider-Version=1.3`;
const seriesUrl = `https://195-154-185-117.1fa6c2d7e4d148db9e380a96583039ad.plex.direct:32400/library/sections/1/all?type=2&sort=episode.addedAt%3Adesc&includeCollections=1&includeAdvanced=1&includeMeta=1&X-Plex-Container-Start=${movieStart}&X-Plex-Container-Size=${movieEnd}&X-Plex-Product=Plex%20Web&X-Plex-Version=4.49.2&X-Plex-Client-Identifier=o6gz0i8lr4gpu8bz7e9gkajg&X-Plex-Platform=Chrome&X-Plex-Platform-Version=87.0&X-Plex-Sync-Version=2&X-Plex-Features=external-media%2Cindirect-media&X-Plex-Model=hosted&X-Plex-Device=OSX&X-Plex-Device-Name=Chrome&X-Plex-Device-Screen-Resolution=1437x1305%2C2560x1440&X-Plex-Token=UdMoTNn42q9Uzxi-6EsR&X-Plex-Language=es&X-Plex-Drm=widevine&X-Plex-Text-Format=plain&X-Plex-Provider-Version=1.3`;

const moviesType = 'movie';
const showsType  = 'show';

const db = admin.firestore();


async function addNewReview (review, browser) {
  console.log(review.title);
  db.collection(`${review.type}s`).doc(review.title).set(review);
  await browser.close();
}

async function getReview (moviePlexInfo) {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page    = await browser.newPage();

  const searchTerm = moviePlexInfo.title;

  await page.goto('https://www.filmaffinity.com/es/main.html', { waitUntil: 'networkidle2', timeout: 0 });

  await page.waitFor('.qc-cmp2-summary-buttons');
  await page.click('button.sc-ifAKCX.ljEJIv')

  await page.waitFor('#top-search-input');
  await page.$eval('#top-search-input', (el, searchTerm) => el.value = searchTerm, searchTerm);
  await page.click('input[type="submit"]');

  await page.waitForSelector('#main-content-table');

  if (moviePlexInfo.title.indexOf("/") === -1) {
    if (page.url().search('search') === -1) {
      await getMovieReviewFromDetail(browser, page, moviePlexInfo);
    }

    if (page.url().search('search') === 32) {
      await getMovieReviewFromSearch(browser, page, moviePlexInfo);
    }

    if (page.url().search('search') === 35) {
      await addNewReview(moviePlexInfo, browser);
    }
  } else {
    await browser.close();
  }
}

async function getMovieReviewFromDetail(browser, page, moviePlexInfo, urlSearchPage) {
  const review    = await utils.evaluateFilmaffinityPage(page, moviePlexInfo);
  const newReview = db.collection(`${review.type}s`).doc(review.title);


  if (typeof urlSearchPage !== 'undefined') {
    await page.goto(urlSearchPage, { waitUntil: 'networkidle2', timeout: 0 });
  }

  await page.waitForSelector('#mt-content-cell');

  await addNewReview(review, browser);

  newReview.get()
    .then(doc => {
      if (!doc.exists) {
        console.log('Nuevo encontrado y añadido a la base de datos');
        db.collection(`${review.type}s`).doc(review.title).set(review);
      } else {
        console.log('El documento ya está en la base de datos');
        process.exit();
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });

  await browser.close();
}

async function getMovieReviewFromSearch(browser, page, moviePlexInfo) {
  await page.waitForSelector('.z-search');

  const urlSearchPage = await page.evaluate(() => {
    return document.querySelector('.z-search > .se-it .mc-poster > a[href]').outerHTML.split('"')[3].toString();
  });

  await getMovieReviewFromDetail(browser, page, moviePlexInfo, urlSearchPage);
}

async function createReview(type) {
  const mediaListJSON = await utils.convertXMLtoJSON(type);

  for (let i = 1; i < mediaListJSON.elements[0].elements.length; i++) {
    let movieInfo = mediaListJSON.elements[0].elements[i];

    console.log(movieInfo.attributes.title);

    let movieInfoFiltered = await utils.filterMediaPlexInfo(movieInfo);
    await getReview(movieInfoFiltered);
  }
}

async function initByType (url, type) {
  await utils.writeXMLtoJSON(url, type);
  await createReview(type);
}

async function initCronTab () {
  // initByType(moviesUrl, moviesType);
  initByType(seriesUrl, showsType);
}

exports.init = async () => initCronTab();
