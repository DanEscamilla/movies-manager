var express = require('express');


function createCustomRoutesRouter(localDB){

  const router = express.Router({ mergeParams:true});

  router.put('/api/multiMovies/',function(req,res){
    req.body.forEach(movieObj=>{
      updateMovieAndGenres(movieObj,localDB)
    })
    res.sendStatus(200);
  });
  return router;
}


async function updateMovieAndGenres(movieObj,localDB){
  let options = {
    where:{
      id:movieObj.id,
    }
  }
  return await localDB.movie.update(movieObj,options)
  .then(affectedRows=>{
    return localDB.genre.findOrCreate(movieObj.genres);
  })
  .then(genres=>{
    return localDB.movie.findOne(options)
    .then(movie=>{
      return movie.setGenres(genres);
    })
  });
}

module.exports = createCustomRoutesRouter;
