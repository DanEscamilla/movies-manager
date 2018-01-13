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

api.createResource({
  model: localDB.movie,
  endpoint: '/api/movies/',
  excludeAttributes:['createdAt','updatedAt'],
  include:[{
    model:localDB.genre,
    attributes:[]
  }]
})
api.createResource({
  model: localDB.genre,
  endpoint: '/api/genres/',
  attributes:['name'],
  excludeAttributes:['createdAt','updatedAt']
})

localDB.sequelize.sync().then(()=>{

    // let query = {
    //   group : ["movie.name"],
    //   having : ['COUNT(distinct `genres`.`id`) = ?', 2],
    //   attributes:["name"],
    //   include:[{
    //     model:localDB.genre,
    //     required:true,
    //     attributes:[],
    //     where:{id:['2','3']},
    //   }]
    // }
    // localDB.movie.findAndCountAll(query).then((row)=>{
    //   let arr;
    //   console.log(row.count);
    // })

    server.listen(3001,function(){
      console.log("corriendo!");
    });

});
