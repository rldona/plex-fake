const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const app = express();

const admin = require("firebase-admin");
// const serviceAccount = require("/Users/raul/plex-fake-firebase-adminsdk-li2uo-6a85b19e72.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://plex-fake.firebaseio.com"
});

const scrapper = require('./scrapper');

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	next();
});

require('./routes')(app);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is up a port ${port}!`);

  scrapper.init();

});
