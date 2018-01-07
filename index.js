var express = require('express');
var indexFile = "/home/mazin0/NodeProjects/movies-app-front/public/index.html";
let app = express();
var path = require('path');
let api = require('./api/api');
var localDB = require('./database/models/local/index');

// console.log(path.join(__dirname, 'public'));
app.use('/public',express.static("/media/mazin0/E034C99434C96E5A/uTorrentDownloads/Movies/"));
app.use('/static',express.static(__dirname+"/public"));
app.use(express.static("/home/mazin0/NodeProjects/movies-app-front/public"));


app.use(function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
res.header("Access-Control-Allow-Methods", "POST,GET,PUT");
next();
});

app.get('/',function(req,res){
  res.sendFile(indexFile);
});

localDB.sequelize.sync().then(()=>{
    api.start(app,localDB);


    app.listen(3000,function(){
      console.log("corriendo!");
    });

});
