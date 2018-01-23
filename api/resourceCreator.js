var express = require('express');
var queryCreator = require('./actions/queryCreator');
var Actions = require('./actions/actions.js')

var resourceCreator = (function(){

  let executeHooks = (actions,req,res,options)=>{
    let actionsArray = [];

    if (actions.start) actionsArray.push(actions.start);
    if (actions.build)  actionsArray.push(actions.build);
    if (actions.before) actionsArray.push(actions.before);
    if (actions.action) actionsArray.push(actions.action);
    if (actions.sent) actionsArray.push(actions.sent);

    actionsArray = actionsArray.reverse();
    let context = {model:options.model,query:{},options:options};
    let chain =  createMiddleware(actionsArray[0],req,res,context,function(){});
    for (let i=1;i<actionsArray.length;i++){
     chain = createMiddleware(actionsArray[i],req,res,context,chain);
    }
    return chain;
  }

  let createMiddleware = (fn,req,res,context,next)=>{
    return ()=>{
      fn(req,res,context,next);
    }
  }
  let createResource = (options)=>{
    var resource = {
      create:Actions.buildCreate(),
      list:Actions.buildList(),
      read:Actions.buildRead(),
      update:Actions.buildUpdate(),
      router:null,
      endpoint:options.endpoint,
    };
    resource.router = createRouter(options,resource);

    return resource;
  }

  let createRouter = (options,resource)=>{
    queryCreator.normalizeOptions(options);

    let router = express.Router({ mergeParams:true});

    router.get('/',function(req,res){
      executeHooks(resource.list,req,res,options)();
    });

    router.get('/:id',function(req,res){
      executeHooks(resource.read,req,res,options)();
    });
    router.put('/:id',function(req,res){
      executeHooks(resource.update,req,res,options)();
    });
    router.post('/',function(req,res){
      executeHooks(resource.create,req,res,options)();
    });

    return router;
  }

  return {
    createResource:createResource,
	};

})();
module.exports = resourceCreator;
