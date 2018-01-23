var express = require('express');
var indexFile = "/home/mazin0/NodeProjects/movies-app-front/public/index.html";
var path = require('path');
let api = require('./api/api');
var localDB = require('./database/models/local/index');
var http = require('http');
var app = express();
var bodyParser = require('body-parser');
var moviesFinder = require('./moviesFinder');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public',express.static("/media/mazin0/E034C99434C96E5A/uTorrentDownloads/Movies/"));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST,GET,PUT");
  next();
});

var server = http.createServer(app);

var movieResource = api.createResource({
  model: localDB.movie,
  excludeAttributes:['createdAt','updatedAt'],
  order:['-updatedAt'],
});
var collectionResource = api.createResource({
  model: localDB.collection,
  excludeAttributes:['createdAt','updatedAt'],
  order:['-updatedAt'],
});
var genreResource = api.createResource({
  model: localDB.genre,
  excludeAttributes:['createdAt','updatedAt']
});

app.use('/api/collections/',collectionResource.router);
app.use('/api/collections/:collectionId/',movieResource.router)
app.use('/api/genres/',genreResource.router);

movieResource.list.before=function(req,res,context,next){
  if (req.query.genreId){
    if (!Array.isArray(req.query.genreId)){
      req.query.genreId = [req.query.genreId];
    }
    context.query.group=["movie.name"];
    context.query.having= localDB.sequelize.literal('COUNT(distinct `genres`.`id`) = '+req.query.genreId.length);
    context.query.include.push({
      model:localDB.genre,
      required:true,
      attributes:[],
      where:{id:req.query.genreId},
      duplicating:false,
    });
  }
}

localDB.sequelize.sync().then(()=>{
    // moviesFinder.findMovies(localDB);
    server.listen(3000,"192.168.2.106",function(){
      console.log("corriendo!");
    });

});
