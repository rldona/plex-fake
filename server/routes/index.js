const admin = require("firebase-admin");

const db = admin.firestore();

// let obj = {
//   first: 'Ada',
//   last: 'Lovelace',
//   born: 1814
// }

// db.collection('users').doc(uniqid()).set(obj);

// Recuperar todos los elementos de una colección
// TODO: crear limitaciones para paginar las busquedas desde los endpoints
// db.collection('users').get()
//   .then((snapshot) => {
//     snapshot.forEach((doc) => {
//       console.log(doc.id, '=>', doc.data());
//     });
//   })
//   .catch((err) => {
//     console.log('Error getting documents', err);
//   });


// borrar todos los elelmentos de una colección
// db.collection('users').get()
//   .then((snapshot) => {
//     snapshot.forEach((doc) => {
//       db.collection('users').doc(doc.id).delete();
//     });
//   })
//   .catch((err) => {
//     console.log('Error getting documents', err);
//   });

module.exports = function(app) {

  app.get('/movies', async (req,res) => {
    // const type = req.query.type;
    // const page = parseInt(req.query.page);
    // const size = parseInt(req.query.size);

    let movieList = [];

    db.collection('movies').orderBy('order').get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          movieList.push(doc.data());
        });
        res.json(movieList);
      })
      .catch((err) => {
        console.log('Error getting documents', err);
      });

    // MongoDB

    // await mongodb.connect(type);

    // var query = {};

    // if (page < 0 || page === 0) {
    //   response = {
    //     'error': true,
    //     'message': 'invalid page number, should start with 1'
    //   };
    //   return res.json(response)
    // }

    // query.skip = size * (page - 1);
    // query.limit = size

    // Media.countDocuments({}, function(err, totalCount) {
    //   if(err) {
    //     response = {
    //       'error': true,
    //       'message': 'Error fetching data'
    //     }
    //   }

    //   Media.find({}, {}, query, function(err,data) {
    //     if(err) {
    //         response = {
    //           'error': true,
    //           'message': 'Error fetching data'};
    //     } else {
    //         var totalPages = Math.ceil(totalCount / size)
    //         response = {
    //           'response': 'success',
    //           'data': data,
    //           'pages': totalPages
    //         };
    //     }
    //     res.json(response);
    //   });
    // })
  });

  app.get('/series', async (req,res) => {
    res.json(series);
  });

  app.get('/scrapper', async (req,res) => {
    res.json(series);
  });

}
