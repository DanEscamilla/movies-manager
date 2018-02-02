let express = require('express');
let moviesFinder = require('../fileLookUp/moviesFinder')

function loadResourcesMiddleware(resources,localDB,app){

  resources.movie.list.before=function(req,res,context,next){
    context.query.where['$and'].push({collectionName: req.params.collectionId});
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

  resources.collection.create.sent=function(req,res,context,next){
    if (context.results){
      app.use('/'+context.results.name,express.static(context.results.path));
      moviesFinder.findMovies(localDB,context.results);
    }
    next();
  }
}

module.exports = loadResourcesMiddleware;
