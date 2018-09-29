let express = require('express');

function createStaticServers(localDB,router){
  return localDB.collection.findAll().then(collections=>{
    collections.forEach(collection=>{
      let collectionInfo = collection.get();
      router.use('/'+collectionInfo.id,express.static(collectionInfo.path));
    })
  })
  .catch(err=>{
    console.log(err);
  })
}
module.exports = createStaticServers;
