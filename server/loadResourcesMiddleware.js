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
}

module.exports = loadResourcesMiddleware;
