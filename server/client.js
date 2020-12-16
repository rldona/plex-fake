const path = require('path');
const express = require('express');
const app = express();
const publicPath = path.join(__dirname, '..', 'build');
const cors = require('cors');

app.use(cors());

app.use(express.static(publicPath));

app.get('*', (req, res) => {
   res.sendFile(path.join(publicPath, 'index.html'));
});

const port = process.env.PORT || 4242;

app.listen(port, () => {
   console.log(`Client is up a port ${port}!`);
});
