const fileFinder = require("./fileLookUp/fileFinder");
// const imdbLooker = require("./fileLookUp/imdbLooker");
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
        dbInterface.createMovie(parseInfo(movieFileInfo))
        .then(movie=>{
          dbInterface.addMovieToCollection(collection,movie);
        });
      });
    })
    .catch((err)=>{
      console.log(err);
    });
};

function parseInfo(info){
  let parsedName = parseTorrentName(info.name);
  info.name = parsedName.title;
  info.year = parsedName.year;
  if (parsedName.season && parsedName.episode){
    info.name += " S"+zeroPad(parsedName.season,2)+"E"+zeroPad(parsedName.episode,2);
  }
  return info;
}
function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}
