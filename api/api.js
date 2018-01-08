const bodyParser = require('body-parser');

var api = (function(){

  let app;
  let db;

  var start = function(express,db){
    app = express;


    app.use(bodyParser.json());
    app.get('/api/movies',function(req,res){
      db.movie.findAll().then((results)=>{
        res.send(results);
      });
    });

    app.put('/api/movies/:id',function(req,res){
      let query={
        where:{
          id:req.params.id
        }
      }
      // db.movie.build(req.body).save().then((dbRes)=>{
      //   console.log(dbRes);
      //   res.send("ok");
      // });
      // db.movie.update(req.body,query).then((results)=>{
      //   res.send(results);
      // });
    });


    app.get('/api/movie/:id',function(req,res){
      let query={
        where:{
          id:req.params.id
        }
      }
      db.movie.findAll(query).then((results)=>{
        res.send(results);
      });
    });

    // app.get('/api/genres',function(req,res){
    //   pool.query('select * from genres',(err,results,fields)=>{
    //     if (err){
    //       throw err;
    //     }
    //     res.send(results);
    //   })
    // });
  }

  return {
  		start:start
  	};

})();

module.exports = api;
