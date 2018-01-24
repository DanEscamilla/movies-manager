const fs = require('fs')

var dbInterface = (function(){

  let imdbLooker;
  let db;
  let operators;

  var createMovie = function(info){
    return db.movie.create(info);
  }

  var addMovieToCollection = function(collection,movie){
    collection.addMovie(movie);
  }

  var setDB = function(sequelizeDB){
    db = sequelizeDB;
    operators = db.Sequelize.Op;
  }

  return {
    setDB:setDB,
    addMovieToCollection:addMovieToCollection,
    createMovie:createMovie,
    // updateGenres:updateGenres
  };

})();
module.exports = dbInterface;
