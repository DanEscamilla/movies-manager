var express = require('express');
var indexFile = "/home/mazin0/NodeProjects/movies-app-front/public/index.html";
var path = require('path');
let api = require('./api/api');
var localDB = require('./database/models/local/index');
var http = require('http');
var epilogue = require('epilogue');
// initialize the server
var app = express();
var server;
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public',express.static("/media/mazin0/E034C99434C96E5A/uTorrentDownloads/Movies/"));
app.use(function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
res.header("Access-Control-Allow-Methods", "POST,GET,PUT");
next();
});

server = http.createServer(app);

epilogue.initialize({
  app:app,
  sequelize:localDB.sequelize
});

var userResource = epilogue.resource({
  model: localDB.movie,
  endpoints: ['/api/movies', '/api/movies/:id'],
  excludeAttributes:['createdAt','updatedAt' ]
});

// app.get('/',function(req,res){
//   res.sendFile(indexFile);
// });
localDB.sequelize.sync().then(()=>{
    // api.start(app,localDB);


    server.listen(3000,function(){
      console.log("corriendo!");
    });

});
