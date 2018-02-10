let express = require('express');
let moviesFinder = require('../fileLookUp/moviesFinder')

function loadResourcesMiddleware(resources,localDB,app){

  resources.collection.create.sent=function(req,res,context,next){
    if (context.result){
      let options={
        fixNames:req.query.fixNames,
      }
      app.use('/'+context.result.id,express.static(context.result.path));
      moviesFinder.findMovies(localDB,context.result,req.query);
    }
    next();
  }

  resources.collectionMovie.list.before=function(req,res,context,next){
    if (req.query.genreId){
      if (!Array.isArray(req.query.genreId)){
        req.query.genreId = [req.query.genreId];
      }
      context.query.group=["movie.name"];
      context.query.having= localDB.sequelize.literal('COUNT(distinct `genres`.`id`) = '+req.query.genreId.length);
      context.query.include.push({
        model:localDB.genre,
        required:true,
        attributes:[],
        where:{id:req.query.genreId},
        duplicating:false,
      });
    }
    next();
  }

}

module.exports = loadResourcesMiddleware;
