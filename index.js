let express = require('express');
let localDB = require('./database/models/local/index');
let loadMiddleware = require('./server/loadMiddleware');
let loadResourcesMiddleware = require('./server/loadResourcesMiddleware');
let createResources = require('./server/createResources');
let createStaticServers = require('./server/createStaticServers');
let createCustomRoutesRouter = require('./server/createCustomRoutesRouter');

let app = express();
let resources = createResources(localDB);
let customRoutesRouter = createCustomRoutesRouter(localDB);

loadMiddleware(app);
createStaticServers(localDB,app);
loadResourcesMiddleware(resources);

app.use('/api/movies/',resources.movie.router);
app.use('/api/collections/',resources.collection.router);
app.use('/api/genres/',resources.genre.router);
app.use('/',customRoutesRouter);


localDB.sequelize.sync().then(()=>{
    app.listen(3000,function(){
      console.log("corriendo!");
    });
});
