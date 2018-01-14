var express = require('express');
var queryCreator = require('./queryCreator');

var resourceCreator = (function(){

  let init = (seq)=>{
    queryCreator.init(seq);
  }

  let createHooks = ()=>{
    return {
      start:null,
      before:null,
      data:null,
      sent:null,
    }
  }

  let createResource = (options)=>{
    var resource = {
      delete:createHooks(),
      create:createHooks(),
      list:createHooks(),
      read:createHooks(),
      update:createHooks(),
      router:null,
      endpoint:options.endpoint,
    };
    resource.router = createRouter(options,resource);

    return resource;
  }

  let beforeData = (req,res,hook,options)=>{

      if (hook.start){
          hook.start(req,res,{});
      }

      let obj=queryCreator.fabricateQuery(req,options)

      if (hook.before){
          hook.before(req,res,obj.query);
      }
      return obj;
  }
  let afterData = (req,res,hook,results)=>{
      if (hook.data){
        hook.data(req,res,results);
      }
      res.send(results);
      if (hook.sent){
        hook.sent(req,res,results);
      }
  }

  let createRouter = (options,resource)=>{
    queryCreator.normalizeOptions(options);

    let router = express.Router({ mergeParams:true});

    router.get('/',function(req,res){
      let obj = beforeData(req,res,resource.list,options);
      let model = obj.model;
      let query = obj.query;
      model.findAll(query).then((results)=>{
        afterData(req,res,resource.list,results);
      });
    });
    router.get('/:movie',function(req,res){
      let obj = beforeData(req,res,resource.read,options);
      let model = obj.model;
      let query = obj.query;
      model.describe().then(function (schema) {
          let PK = Object.keys(schema).filter(function(field){
              return schema[field].primaryKey;
          });
          query.where[PK] = req.params.movie;
          model.findOne(query).then((result)=>{
            afterData(req,res,resource.read,result);
          });
      })
    });
    router.put('/:movie',function(req,res){
        let model = options.model;
        let query = {where:{}};
        model.describe().then(function (schema) {
            let PK = Object.keys(schema).filter(function(field){
                return schema[field].primaryKey;
            });
            query.where[PK] = req.params.movie;
            model.update(req.body,query).then((result)=>{
              afterData(req,res,resource.update,result);
            });
        })
    });

    return router;
  }

  return {
		init:init,
    createResource:createResource,
	};

})();
module.exports = resourceCreator;
