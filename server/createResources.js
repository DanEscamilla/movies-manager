let api = require('../api/api');

function createResources(localDB){
  let resources = {};

  resources.movie = api.createResource({
    model: localDB.movie,
    excludeAttributes:['createdAt','updatedAt'],
    order:['-updatedAt'],
    endpoint:'/api/movies/',
  });
  resources.collection = api.createResource({
    model: localDB.collection,
    excludeAttributes:['createdAt','updatedAt'],
    order:['-updatedAt'],
    endpoint:'/api/collections/',
  });
  resources.genre = api.createResource({
    model: localDB.genre,
    excludeAttributes:['createdAt','updatedAt'],
    endpoint:'/api/genres/',
  });
  resources.collectionMovie = api.createAssociatedResource({
    model: localDB.movie,
    parentResource:resources.collection,
    excludeAttributes:['createdAt','updatedAt'],
    order:['-updatedAt'],
    endpoint:'/movies/',
  });
  resources.movieGenre = api.createAssociatedResource({
    model: localDB.genre,
    parentResource:resources.movie,
    excludeAttributes:['createdAt','updatedAt'],
    // order:['-updatedAt'],
    endpoint:'/genres/',
  });
  return resources;
}

module.exports = createResources;