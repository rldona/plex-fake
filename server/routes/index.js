const admin = require("firebase-admin");

const db = admin.firestore();

// TODO: lanzarlo con una lambda en AWS o DigitalOceans

module.exports = function(app) {

  app.get('/media', async (req,res) => {
    const type   = req.query.type || 'movies';
    const filter = req.query.filter || 'title';
    const limit  = parseInt(req.query.limit) || 50;
    const page   = parseInt(req.query.page) || 0;

    let mediaList = [];

    // TODO: refactorizar y dejar una única llamada a la colleción añadiendo o quitando el startAfter()

    if (page === 0) {
      db.collection(type)
        .orderBy(filter)
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
    } else {
      const max      = limit * page;
      const first    = db.collection(type).orderBy(filter).limit(max);
      const snapshot = await first.get();

      let last = snapshot.docs[snapshot.docs.length - 1];

      db.collection(type)
        .orderBy(filter)
        .limit(limit)
        .startAfter(last)
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
    }

  });

}
