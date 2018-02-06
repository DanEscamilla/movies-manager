let express = require('express');

function createStaticServers(localDB,app){
  localDB.collection.findAll().then(collections=>{
    collections.forEach(collection=>{
      let collectionInfo = collection.get();
      app.use('/'+collectionInfo.id,express.static(collectionInfo.path));
    })
  })
  .catch(err=>{
    console.log(err);
  })
}
module.exports = createStaticServers;
