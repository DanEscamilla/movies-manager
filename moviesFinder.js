const fileFinder = require("./fileLookUp/fileFinder");
const imdbLooker = require("./fileLookUp/imdbLooker");
const dbInterface = require("./fileLookUp/dbInterface");
const posterDownloader = require("./fileLookUp/posterDownloader");
const parseTorrentName = require("parse-torrent-name");

var imdbDB =  require('./database/models/imdb/index');

var path = "/media/mazin0/E034C99434C96E5A/uTorrentDownloads/Movies";
var name = "Movies";



module.exports.findMovies = function(localDB){
    // imdbLooker.setDB(imdbDB);
    dbInterface.setDB(localDB);

    fileFinder.find(path,name)
    .then(function(movieFilesInfo){
      movieFilesInfo.forEach((movieFileInfo)=>{

        dbInterface.findMovieInDB(movieFileInfo)
        .then((movie)=>{
          console.log("movie found");
          return movie;
        })
        .catch((err)=>{
          console.log("movie not found");
          return dbInterface.createMovie(movieFileInfo);
        })
        .then((movie)=>{
          console.log(movie.get());
          movie.save();
        })
        // imdbLooker.lookUp(movieFileInfo);
      })
      let promises = [];
      // for (let i=0;i<movieNames.length;i++){
      //   if (movieNames[i].id){//movieNames[i].id
      //     console.log("yep");
      //     //returns promise that confirms that the id read from the file belongs to an entry in the database,
      //     //the promise returns the entry when resolved, creates new one if the entry is no longer in the db and returns that
      //     promises.push(dbInterface.updateRegistry(movieNames[i]));
      //   } else {
      //     //returns promise that creates a new entry in the database, returns the entry when resolved
      //     promises.push(dbInterface.newRegistry(movieNames[i]));
      //   }
      // }
      //
      // //calls a downloadPoster on the entrys from the database obtained in th previous statusCode
      // // it does so in sequence, waits for downloadPoster to finish to call the next one
      // let result = Promise.resolve();
      // promises.forEach(promise => {
      //   promise.then((movie)=>{
      //     console.log(movie);
      //     dbInterface.updateGenres(movie);
      //     result = result.then((previous) =>{
      //       return posterDownloader.download(movie.get()).then((res)=>{console.log})
      //     })
      //     .catch((err)=>{
      //       console.log("Error al bajar el poster");
      //       console.log(err);
      //     });
      //   });
      // });
      // //
      // Promise.all(promises).then((res)=>{ //once all the entries have been resolved call this function
      //   result = result.then(()=>{ //once all the posters have been downloaded, call this function
      //     console.log("\n\n\n\n\n\n\n\nfinished");
      //     // process.exit();
      //   });
      // });

    })
    .catch((err)=>{
      console.log("wtf");
      console.log(err);
    });
};
