let express = require('express');
let localDB = require('./database/models/local/index');
let loadMiddleware = require('./server/loadMiddleware');
let loadResourcesMiddleware = require('./server/loadResourcesMiddleware');
let createResources = require('./server/createResources');
let customEndpoints = require('./server/customEndpoints');
let createStaticServers = require('./server/createStaticServers');
let initScripts = require('./server/initScripts');

let app = express();
let resources = createResources(localDB);

loadMiddleware(app);
createStaticServers(localDB,app);
loadResourcesMiddleware(resources,localDB,app);
// app.use(function(req,res,next){
//   console.log(req.url);
//   console.log(req.query);
//   next();
// })
app.use(resources.collection.endpoint,resources.collection.router);
app.use(resources.movie.endpoint,resources.movie.router);
app.use(resources.genre.endpoint,resources.genre.router);
app.use(customEndpoints(localDB));


localDB.sequelize.sync().then(()=>{

    // localDB.sequelize.query("PRAGMA journal_mode=WAL;").then(res=>console.log("WAL ACTIVATE!!!  "));

    initScripts(localDB);

    app.listen(3000,function(){
      console.log("corriendo!");
    });
});
