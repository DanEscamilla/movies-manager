var express = require('express');


function createCustomRoutesRouter(localDB){

  const router = express.Router({ mergeParams:true});

  router.post('/api/movie-genres/:movieId/',function(req,res){
    localDB.movie.findOne({where:{id:req.params.movieId}})
    .then(movie=>{
      createGenres(req.body,localDB)
      .then(genres=>{
        movie.setGenres(genres)
        .then(done=>{
          res.sendStatus(200);
        })
        .catch((err)=>{
          console.log(err);
          res.sendStatus(400);
        });
      })
    })
    .catch(err=>{
      console.log(err);
      res.sendStatus(400);
    });
    });
  return router;
}

async function insertGenres(genres,movie,localDB){
  for (let genre of genres){
    await localDB.genre.findOrCreate({where:{name:genre.name}})
          .then(genre=>{
            return movie.addGenres(genre[0])
          })
  }
}
async function createGenres(genres,localDB){
  let genreInstances = [];
  for (let genre of genres){
    genreInstances.push(await localDB.genre.findOrCreate({where:{name:genre.name}}).then(genre=>genre[0]));
  }
  return genreInstances;
}

module.exports = createCustomRoutesRouter;
