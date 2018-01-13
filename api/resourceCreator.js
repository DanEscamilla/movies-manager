var path = require('path');

var resourceCreator = (function(){
  let app;
  let sequelize;

  let init = (seq,a)=>{
    app = a;
    sequelize = seq;
  }
  let buildQSearch = (attributes,value)=>{
    let qCondition= {$or:[]};
    attributes.forEach((attr)=>{
      let attributeLike = {}
      attributeLike[attr]={}
      attributeLike[attr].$like='%'+value+'%';
      qCondition.$or.push(attributeLike);
    });
    return qCondition;
  }
  let findSearchOption = (key,searchOptions)=>{
    for (let i=0;i<searchOption.length;i++){
      if (key==searchOption[i].param){
        return searchOption[i];
      }
    }
    return null;
  }

  let appendSearchOption = (where,options,value)=>{
    let attributes = options.attributes||[];
    let operator = options.operator||'%eq';
    attributes.forEach((attr)=>{
      let obj = {}
      obj[attr]={}
      obj[attr][operator]=value;
      where.$and.push(obj);
    });
  }

  let getOrderingArray = (arrParams)=>{
    return arrParams.map((param)=>{
      if (param.charAt(0)=="-"){
        return [sequelize.fn('max', sequelize.col(param)), 'DESC'];
      }
      return [sequelize.fn('max',  sequelize.col(param))];
    });
  }
  let normalizeOptions = (options)=>{
    options.attributes = options.attributes ||getAttributesArray(options.model);
    if (options.excludeAttributes){
      options.excludeAttributes.forEach((attr)=>{
        let index = options.attributes.indexOf(attr)
        if (index>=0){
          options.attributes.splice(index,1);
        }
      })
    }

    options.order=((options.order)?getOrderingArray(options.order):undefined);
  };

  let initQuery = (options)=>{
    let obj ={
      attributes: options.attributes,
      order:options.order,
      where:{
        $and:[]
      }
    }
    obj = JSON.parse(JSON.stringify(obj));
    obj.include=((!options.include===Array)?[options.include]:options.include);
    return obj;
  }

  let getAttributesArray = (model)=>{
    let arr =[];
    Object.keys(model.rawAttributes).forEach((key)=>{
      arr.push(key);
    })
    return arr;
  }
  let endpointById = (endpoint)=>{
    return path.normalize(endpoint)+":id"
  }
  let fabricateQuery = (req,options)=>{
    let query = initQuery(options);
    let page,perPage,scope,model=options.model;
    Object.keys(req.query).forEach(function(key,index) {
      let value =req.query[key];
      switch(key){
        case 'q':
          query.where.$and.push(buildQSearch(options.attributes,value));
          return;
        break;
        case 'order':
          query.order = getOrderingArray(value);
          return;
        break;
        case 'page':
          page=parseInt(value);
          return;
        break;
        case 'perPage':
          perPage=parseInt(value);
          return;
        break;
        case 'scope':
          scope=value;
          return;
        break;
      }
      let searchOption = findSearchOption(key);
      if (searchOption){
        appendSearchOption(query.where,searchOption,value);
      } else {
        appendSearchOption(query.where,{attributes:[key]},value);
      }
    });
    if (page!=null){
      perPage = perPage||50;
      query.offset = page*perPage;
      query.limit = perPage;
    }
    if (scope){
      model = model.scope(scope);
    }
    return {query:query,model:model};
  }

  let createResource = (options)=>{
    // console.log(options);
    normalizeOptions(options);

    app.get(options.endpoint,function(req,res){
      let obj=fabricateQuery(req,options)
      let model = obj.model;
      let query = obj.query;
      model.findAll(query).then((results)=>{
        res.send(results);
      });
    });
    app.get(endpointById(options.endpoint),function(req,res){

      let obj=fabricateQuery(req,options)
      let model = obj.model;
      let query = obj.query;

      model.describe().then(function (schema) {
          let PK = Object.keys(schema).filter(function(field){
              return schema[field].primaryKey;
          });
          query.where[PK] = req.params.id;

          model.findOne(query).then((result)=>{
            res.send(result);
          });
      })

    });
  }
  return {
		init:init,
    createResource:createResource
	};

})();
module.exports = resourceCreator;
