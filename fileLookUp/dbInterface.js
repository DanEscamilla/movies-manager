const fs = require('fs')

var dbInterface = (function(){

  let imdbLooker;
  let db;
  let operators;

  var createMovie = function(info){
    return db.movie.build(info);
  }

  var addMovieToCollection = function(collection,movie){
    db.collection.addMovie(movie);
  }

  // var findMovieInDB = function(info){
  //   let query = {
  //     where:{
  //       [operators.and]:[
  //         {path:info.path},
  //         {filename:info.filename}
  //       ]
  //     }
  //   }
  //   return new Promise((resolve,reject)=>{
  //     db.movie.findOne(query).then(res=>{
  //       if (res){
  //         resolve(res);
  //       } else {
  //         reject(null);
  //       }
  //     })
  //   });
  // }

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
