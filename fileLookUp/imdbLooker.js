const stringSimilarity = require("string-similarity");


var imdbLooker = (function(){

  let db;

  var lookUp = function(info){ //tries to look the name read from the file (and year if avaiable) to an imdb title in the db, if it does it returns the info from the db

      let torrentNameMeta = parseTorrentName(info.name);

      return db.imdb_movie.findAll(createQuerySequelize(torrentNameMeta.year,torrentNameMeta.title)).then((row)=>{
        if (row.length>0){
          let potentialMatches = []
          for (let i=0;i<row.length;i++){
            potentialMatches.push(row[i].get().prim_title);
            potentialMatches.push(row[i].get().orig_title);
          }
          console.log("pot matches: ",potentialMatches.length,torrentNameMeta.title);
          console.log(stringSimilarity.findBestMatch(torrentNameMeta.title,potentialMatches));
          var indexOfBestMatchInDBResults = potentialMatches.indexOf(stringSimilarity.findBestMatch(torrentNameMeta.title,potentialMatches).bestMatch.target);
          // result = transformImdbObject(row[indexOfBestMatchInDBResults].dataValues,info);
        } else {
          // result = info;
        }
        db.sequelize.close();
        // return(result);
      });
  }


  var lookUpGenres = function(imdbid){
    let query = {include:[{model:db.imdb_movie,where:{id:imdbid},attributes:[]}],attributes:['id']};
    return db.genre.findAll(query).then((results)=>{
      return results.map(res=>res.get().id);
    }).catch((err)=>{
      console.log(err);
    })
  }

  var createQuerySequelize = function(year,name){
    let operators = db.Sequelize.Op;
    let query = {
      where:{
        [operators.and]:[]
      }
    };

    if (year){
      query.where[operators.and].push({year:year});
    }
    let arr = name.split(' ');
    for (let i=0;i<arr.length;i++){
      query.where[operators.and].push({
        [operators.or]:{
          prim_title:{
              [operators.like]: "%"+arr[i]+"%"
          },
          orig_title:{
              [operators.like]: "%"+arr[i]+"%"
          }
        }
      }
      );
    }

    return query;
  }

  var setDB = function(sequelizeDB) {
    db = sequelizeDB;
  }
  var transformImdbToMovie = function(imdbObj,info){
    return {
      name:imdbObj.prim_title,
      path:info.path,
      duration:imdbObj.duration,
      year:imdbObj.year,
      seen:false,
      imdbid:imdbObj.id,
      rating:imdbObj.rating,
      filename:info.filename,
    };
  }

  return {
    setDB:setDB,
    lookUp:lookUp,
    lookUpGenres:lookUpGenres
  };

})();

module.exports = imdbLooker;
