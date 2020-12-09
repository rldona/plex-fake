const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const app = express();

const scraping = require('./scrapper.js');

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

require('./routes/media')(app);

const port = process.env.PORT || 3000;

app.listen(port, () => {
   console.log(`Server is up a port ${port}!`);
   scraping.init();
});
