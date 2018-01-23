const fileFinder = require("./fileLookUp/fileFinder");
const imdbLooker = require("./fileLookUp/imdbLooker");
const dbInterface = require("./fileLookUp/dbInterface");
const posterDownloader = require("./fileLookUp/posterDownloader");
const parseTorrentName = require("parse-torrent-name");

var imdbDB =  require('./database/models/imdb/index');

// module.exports.isDirectory = function(path){
//   return fileFinder.isDirectory(path);
// }
module.exports.findMovies = function(localDB,path){
    // imdbLooker.setDB(imdbDB);
    dbInterface.setDB(localDB);

    fileFinder.find(path)
    .then(function(movieFilesInfo){
      movieFilesInfo.forEach((movieFileInfo)=>{

        dbInterface.findMovieInDB(movieFileInfo)
        .then((movie)=>{
          console.log("found",movie);
          return movie;
        })
        .catch((err)=>{
          console.log("fuck");
          return dbInterface.createMovie(movieFileInfo);
        })
        .then((movie)=>{
          movie.save();
        })
      })
      let promises = [];
    })
    .catch((err)=>{
      console.log("wtf");
      console.log(err);
    });
};
