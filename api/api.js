
var api = (function(){

  let app;
  let db;

  var start = function(express,db){
    app = express;

    app.get('/api/movies',function(req,res){
      db.movie.findAll().then((results)=>{
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
