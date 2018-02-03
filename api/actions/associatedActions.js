var queryCreator = require('./queryCreator');
var helpers = require('./helpers');

function initHooks(){

  let build = function(req,res,context,next){
    let obj = queryCreator.fabricateQuery(req,context.options);
    context.query = obj.query;
    context.model = obj.model;
    next();
  }
  let parent = function(req,res,context,next){
    context.parentContext = {
      options:context.parentResource.options,
      query:queryCreator.fabricateEmptyQuery(),
      model:context.parentResource.options.model,
    };

    context.parentResource.read.data(req,res,context.parentContext,next);
  }
  return {
    start:null,
    parent:parent,
    build:build,
    before:null,
    data:null,
    action:null,
    sent:null,
  }
}

function buildSet(){
    let hooks = initHooks();
    hooks.build = null;

    hooks.data = function(req,res,context,next){
      helpers.findOrCreate(req.body,context.options)
      .then(instances=>{
        return context.parentContext.result[helpers.buildFunctionName('set',context.options.model.name,true)](instances)
      })
      .then(result=>{
        context.result = result;
        next();
      })
      .catch(err=>{
        context.error = err;
        next();
      })
    }

    hooks.action = function(req,res,context,next){
      if (context.result){
        res.send(context.result);
      } else {
        res.status(400).send(context.error);
      }
      next();
    }
    return hooks;
}
function buildDelete(){
    let hooks = initHooks();

    hooks.data = function(req,res,context,next){
      context.query.where[context.options.primaryKey] = req.params[context.options.paramName];
      context.model.destroy(context.query).then((result)=>{
        context.result = result;
        next();
      }).catch((err)=>{
        context.error = err;
        next();
      });
    }
    hooks.action = function(req,res,context,next){
      if (context.result==0){
        res.status(404).send({message:"Not found"});
      } else if (context.result){
        res.send({rowsModified:context.result});
      } else {
        res.status(400).send(context.error);
      }
      next();
    }
    return hooks;
}

function buildRead(){
    let hooks = initHooks();

    hooks.data = function(req,res,context,next){
      context.query.where[context.options.primaryKey] = req.params[context.options.paramName];
      context.model.findOne(context.query).then((result)=>{
        context.result = result;
        next();
      }).catch((err)=>{
        context.error = err;
        next();
      });
    }
    hooks.action = function(req,res,context,next){
      if (context.result.data===""){
        res.status(404).send({message:"Not found"});
      } else if (context.result){
        res.send(context.result);
      } else {
        res.status(400).send(context.error);
      }
      next();
    }
    return hooks;
}

function buildCreate(){
    let hooks = initHooks();

    hooks.build = null;

    hooks.data = function(req,res,context,next){
      context.model.create(req.body).then((result)=>{
        context.result = result;
        next();
      }).catch((err)=>{
        context.error = err;
        next();
      });
    }

    hooks.action = function(req,res,context,next){
      if (context.result){
        res.send(context.result);
      } else {
        res.status(400).send(context.error);
      }
      next();
    }
    return hooks;
}

function buildList(){
    let hooks = initHooks();

    hooks.data = function(req,res,context,next){
      if (context.parentContext.result){
        context.parentContext.result[helpers.buildFunctionName('get',context.options.model.name,true)](context.query).then((results)=>{
          context.results = results;
          next();
        }).catch((err)=>{
          context.error = err;
          next();
        });
      } else {
        context.error = context.parentContext.error;
        next();
      }
    }

    hooks.action = function(req,res,context,next){
      if (context.results){
        res.send(context.results);
      } else {
        res.status(400).send(context.error);
      }
      next();
    }
    return hooks;
}


module.exports={
  buildList:buildList,
  buildCreate:buildCreate,
  buildSet:buildSet,
  buildRead:buildRead,
  buildDelete:buildDelete,
};
