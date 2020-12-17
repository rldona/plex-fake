const admin = require("firebase-admin");

const db = admin.firestore();

module.exports = function(app) {

  app.get('/media', async (req,res) => {
    const page   = req.query.page || 0;
    const type   = req.query.type || 'movies';
    const filter = req.query.filter || 'order';
    const limit = req.query.limit || 0;

    let start     = limit * (page -1);

    let mediaList = [];

    db.collection(type)
      .orderBy(filter)
      .startAt(start)
      .limit(limit)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          mediaList.push(doc.data());
        });
        res.json(mediaList);
      })
      .catch((err) => {
        console.log('Error getting documents', err);
      });
  });

}