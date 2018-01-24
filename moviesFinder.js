const fileFinder = require("./fileLookUp/fileFinder");
const imdbLooker = require("./fileLookUp/imdbLooker");
const dbInterface = require("./fileLookUp/dbInterface");
const posterDownloader = require("./fileLookUp/posterDownloader");
const parseTorrentName = require("parse-torrent-name");

var imdbDB =  require('./database/models/imdb/index');

// module.exports.isDirectory = function(path){
//   return fileFinder.isDirectory(path);
// }
module.exports.findMovies = function(localDB,collection){
    // imdbLooker.setDB(imdbDB);
    dbInterface.setDB(localDB);

    fileFinder.find(collection.get().path)
    .then(function(movieFilesInfo){
      movieFilesInfo.forEach((movieFileInfo)=>{
        dbInterface.createMovie(movieFileInfo)
        .then(movie=>{
          dbInterface.addMovieToCollection(collection,movie);
        });
      });
    })
    .catch((err)=>{
      console.log("wtf");
      console.log(err);
    });
};
