var express = require('express');
var indexFile = "/home/mazin0/NodeProjects/movies-app-front/public/index.html";
var path = require('path');
let api = require('./api/api');
var localDB = require('./database/models/local/index');
var http = require('http');
var app = express();
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

var server = http.createServer(app);

api.init(app,localDB.sequelize);

var movieResource = api.createResource({
  model: localDB.movie,
  endpoint: '/api/movies/',
  excludeAttributes:['createdAt','updatedAt'],
  order:['-updatedAt'],
});

var genreResource = api.createResource({
  model: localDB.genre,
  endpoint: '/api/genres/',
  excludeAttributes:['createdAt','updatedAt']
});

app.use('/api/movies/',movieResource.router);
app.use('/api/genres/',genreResource.router);

movieResource.list.before=function(req,res,query){
  if (req.query.genreId){
    if (!Array.isArray(req.query.genreId)){
      req.query.genreId = [req.query.genreId];
    }
    query.group=["movie.name"];
    query.having= localDB.sequelize.literal('COUNT(distinct `genres`.`id`) = '+req.query.genreId.length);
    query.include.push({
      model:localDB.genre,
      required:true,
      attributes:[],
      where:{id:req.query.genreId},
      duplicating:false,
    });
  }
}

localDB.sequelize.sync().then(()=>{
    // let num = 2;
    // let query = {
    //   group : ["movie.name"],
    //   having : localDB.sequelize.literal('COUNT(distinct `genres`.`id`) = '+num),
    //   offset:0,
    //   limit:30,
    //   // raw:true,
    //   attributes:["name"],
    //   include:[{
    //     model:localDB.genre,
    //     required:true,
    //     attributes:[],
    //     where:{id:['2','3']},
    //     duplicating:false,
    //   }]
    // }
    // localDB.movie.findAndCountAll(query).then((row)=>{
    //   let arr;
    //   console.log(row.count);
    // })

    server.listen(3000,function(){
      console.log("corriendo!");
    });

});
