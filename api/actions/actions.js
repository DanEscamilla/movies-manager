var queryCreator = require('./queryCreator');
var helpers = require('./helpers');

function initHooks(){
  return {
    start:null,
    build:null,
    before:null,
    action:null,
    sent:null,
  }
}

function buildUpdate(){
    let hooks = initHooks();

    hooks.action = function(req,res,context,next){
      helpers.getPK(context.model).then((PK)=>{
        context.query.where[PK] = req.params.id;
        context.model.update(req.body,context.query).then((result)=>{
          context.results = result;
          res.send(result);
          next();
        }).catch((err)=>{
          context.error = err;
          res.status(400).send(err);
          next();
        });
      })
    }
    return hooks;
}

function buildRead(){
    let hooks = initHooks();

    hooks.build = function(req,res,context,next){
      let obj = queryCreator.fabricateQuery(req,context.options);
      context.query = obj.query;
      context.model = obj.model;
      next();
    }
    hooks.action = function(req,res,context,next){
      helpers.getPK(context.model).then((PK)=>{
        context.query.where[PK] = req.params.id;
        context.model.findOne(context.query).then((result)=>{
          context.result = result;
          res.send(result);
          next();
        }).catch((err)=>{
          context.error = err;
          res.status(400).send(err);
          next();
        });
      });
    }
    return hooks;
}

function buildCreate(){
    let hooks = initHooks();

    hooks.action = function(req,res,context,next){
      context.model.create(req.body).then((result)=>{
        context.results = result;
        res.send(result);
        next();
      }).catch((err)=>{
        context.error = err;
        res.status(400).send(err);
        next();
      });
    }
    return hooks;
}

function buildList(){
    let hooks = initHooks();

    hooks.build = function(req,res,context,next){
      let obj = queryCreator.fabricateQuery(req,context.options);
      context.query = obj.query;
      context.model = obj.model;
      next();
    }
    hooks.action = function(req,res,context,next){
      context.model.findAll(context.query).then((results)=>{
        context.results = results;
        res.send(results);
        next();
      }).catch((err)=>{
        context.error = err;
        res.status(400).send(err);
        next();
      });
    }
    return hooks;
}

module.exports={
  buildList:buildList,
  buildCreate:buildCreate,
  buildUpdate:buildUpdate,
  buildRead:buildRead,
};
