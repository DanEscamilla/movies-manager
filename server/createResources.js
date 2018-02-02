let api = require('../api/api');

function createResources(localDB){
  let resources = {};

  resources.movie = api.createResource({
    model: localDB.movie,
    excludeAttributes:['createdAt','updatedAt'],
    order:['-updatedAt'],
  });
  resources.collection = api.createResource({
    model: localDB.collection,
    excludeAttributes:['createdAt','updatedAt'],
    order:['-updatedAt'],
  });
  resources.genre = api.createResource({
    model: localDB.genre,
    excludeAttributes:['createdAt','updatedAt']
  });

  return resources;
}
module.exports = createResources;
