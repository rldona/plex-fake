const mongodb = require('../utils/mongodb');
const Media = require('../models/media');

const movies = require('../db/movie-db.json');
const series = require('../db/show-db.json');

module.exports = function(app) {

  app.get('/movies', async (req,res) => {
    // const type = req.query.type;
    // const page = parseInt(req.query.page);
    // const size = parseInt(req.query.size);

    // JSON

    res.json(movies);

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

  // app.post('/movies', function(req, res) {
  //   var newMovie = new Movie(req.body);

  //   newMovie.save(function(err) {
  //     if(err) {
  //       res.json({ info: 'Error during Movie create', error: err });
  //     }
  //   });

  //   res.json({ info: 'Movie created successfully' });
  // });

  // app.put('/movies/:id', function (req, res) {
  //   Movie.findById(req.params.id, function(err, movie) {
  //     if (err) {
  //       res.json({ info: 'error during find movie', error: err });
  //     };

  //     if (movie) {
  //       _.merge(movie, req.body);
  //       movie.save(function(err) {
  //         if (err) {
  //           res.json({ info: 'Error during movie update', error: err });
  //         };
  //         res.json({ info: 'Movie updated successfully' });
  //       });
  //     } else {
  //       res.json({ info: 'Movie not found' });
  //     }
  //   });
  // });

  // app.delete('/movies/:id', function (req, res) {
  //   Movie.findByIdAndRemove(req.params.id, function(err) {
  //     if (err) {
  //       res.json({ info: 'Error during remove Movie', error: err });
  //     };
  //     res.json({ info: 'Movie removed successfully' });
  //   });
  // });

}
