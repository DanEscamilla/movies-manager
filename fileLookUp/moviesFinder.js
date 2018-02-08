const fileFinder = require("./fileFinder");
// const imdbLooker = require("./imdbLooker");
const dbInterface = require("./dbInterface");
const posterDownloader = require("./posterDownloader");
const parseTorrentName = require("parse-torrent-name");

// var imdbDB =  require('../database/models/imdb/index');

// module.exports.isDirectory = function(path){
//   return fileFinder.isDirectory(path);
// }
module.exports.findMovies = function(localDB,collection,options){
    // imdbLooker.setDB(imdbDB);
    dbInterface.setDB(localDB);

    fileFinder.find(collection.get().path)
    .then(function(movieFilesInfo){
      movieFilesInfo.forEach((movieFileInfo)=>{
        parseInfo(movieFileInfo,options)
        .then(movieFileInfo=>{
          return dbInterface.createMovie(movieFileInfo);
        })
        .then(movie=>{
          dbInterface.addMovieToCollection(collection,movie);
        });
      });
    })
    .catch((err)=>{
      console.log(err);
    });
};

function parseInfo(info,options){
  return new Promise((resolve,reject)=>{
    // console.log("\n\n\n\n\n\n\n\n",options.fixNames,!options.fixNames);
    if (!(options.fixNames == 'true')){
      return resolve(info);
    }
    let parsedName = parseTorrentName(info.name);
    info.name = parsedName.title;
    info.year = parsedName.year;
    if (parsedName.season && parsedName.episode){
      info.name += " S"+zeroPad(parsedName.season,2)+"E"+zeroPad(parsedName.episode,2);
    }
    resolve(info);
  })
}
function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}
