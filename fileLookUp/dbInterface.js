const fs = require('fs')

var dbInterface = (function(){

  let imdbLooker;
  let db;
  let operators;

  var createMovie = function(info){
    return db.movie.build(info);
  }

  var findMovieInDB = function(info){
    let query = {
      where:{
        [operators.and]:[
          {path:info.path},
          {filename:info.filename}
        ]
      }
    }
    return new Promise((resolve,reject)=>{
      db.movie.findOne(query).then(res=>{
        if (res){
          resolve(res);
        } else {
          reject(null);
        }
      })
    });
  }

 // var updateRegistry = function(info){
 //
 //   return db.movie.findAll(findByIdOrPath(info)).then((row)=>{
 //     if (row.length==0){
 //       //if there is no entry in the db with the id from 'movie-info', delete the file and create a new entry.
 //       return deleteFileAndCreateNewRegistry(info);
 //     } else if (row.length<=1){
 //       let obj = row[0].dataValues;
 //       //if the entry gotten from the id|path in the 'movie-info' file in the filesystem,
 //       //does not have the correct path or id, update it with the correct path or id
 //       if (row[0].dataValues.path != info.path || row[0].dataValues.id != info.id){
 //         row[0].dataValues.id = info.id;
 //         row[0].dataValues.path = info.path;
 //         let query = updateQuery(row[0].dataValues);
 //         db.movie.update(query.toUpdate,query.where).then((updated)=>{
 //           console.log(obj);
 //           return(row[0]);
 //         });
 //       } else {
 //         return(row[0]);
 //       }
 //     } else {
 //       //if there are more than 1 entries with the same path or id, delete them and create a new entry;
 //       return db.movie.destroy(findByIdOrPath(info)).then(()=>{
 //         return newRegistry(info);
 //       });
 //     }
 //   }).catch((err)=>{
 //     console.log("error updating registry",err);
 //     //if there was an error, default to deleteing the existing file and creating a new registry
 //     deleteFileAndCreateNewRegistry(info);
 //   });
 //
 // }

 // var updateGenres = function(movie){
 //    let imdbid = movie.get().imdbid;
 //    if (imdbid){
 //     imdbLooker.lookUpGenres(imdbid).then((ids)=>{
 //       return db.genre.findAll({where:{id:ids}})
 //     }).then((genres)=>{
 //       movie.setGenres(genres);
 //     }) ;
 //    }
 // }
 //
 // var deleteFileAndCreateNewRegistry = function(info){
 //   return deleteInfoFile(info).then(()=>{
 //     return newRegistry(info);
 //   })
 // }
 //
 // var deleteInfoFile = function(info){
 //   return new Promise((resolve,reject)=>{
 //     fs.unlink(info.path+"/.movie-info",(err)=>{
 //       if (err)
 //         reject(err);
 //       resolve();
 //     });
 //   });
 //
 // }
 //
 // var findByIdOrPath = function(info){
 //   return {
 //     where: {
 //       [operators.or]:[
 //        {id:info.id},
 //        {path:info.path}
 //      ]
 //     }
 //   };
 // }
 //
 // var updateQuery = function(obj){
 //
 //   return{
 //     toUpdate:obj,
 //     where:{where:{
 //       id:obj.id
 //     }}
 //   }
 //
 // }
 //
 //  var writeMovieInfo = function(id,path){
 //    fs.writeFile(path+'/.movie-info', id, function (err) {
 //      if (err){
 //        throw err;
 //      }
 //    });
 //  }

  var setDB = function(sequelizeDB){
    db = sequelizeDB;
    operators = db.Sequelize.Op;
  }

  return {
    setDB:setDB,
    findMovieInDB:findMovieInDB,
    createMovie:createMovie,
    // updateGenres:updateGenres
  };

})();
module.exports = dbInterface;
