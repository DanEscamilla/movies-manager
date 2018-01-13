const bodyParser = require('body-parser');
const resourceCreator = require('./resourceCreator');
var api = (function(){

  let app;
  let db;

  var init = function(server,db){
    app = server;


    app.use(bodyParser.json());
    resourceCreator.init(db,app);
    // app.put('/api/movies/:id',function(req,res){
    //   let query={
    //     where:{
    //       id:req.params.id
    //     }
    //   }
    //   // db.movie.build(req.body).save().then((dbRes)=>{
    //   //   console.log(dbRes);
    //   //   res.send("ok");
    //   // });
    //   // db.movie.update(req.body,query).then((results)=>{
    //   //   res.send(results);
    //   // });
    // });



    // app.get('/api/genres',function(req,res){
    //   pool.query('select * from genres',(err,results,fields)=>{
    //     if (err){
    //       throw err;
    //     }
    //     res.send(results);
    //   })
    // });
  }
  var createResource = (options)=>{
    resourceCreator.createResource(options);
  }
  return {
  		init:init,
      createResource:createResource
  	};

})();

module.exports = api;
