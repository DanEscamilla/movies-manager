var path = require('path');
var resourceCreator = (function(){
  let sequelize;

  let init = (seq)=>{
    sequelize = seq;
  };
  let buildQSearch = (attributes,value)=>{
    let qCondition= {$or:[]};
    attributes.forEach((attr)=>{
      let attributeLike = {}
      attributeLike[attr]={}
      attributeLike[attr].$like='%'+value+'%';
      qCondition.$or.push(attributeLike);
    });
    return qCondition;
  };
  let findSearchOption = (key,searchOptions)=>{
    if (searchOptions){
      for (let i=0;i<searchOptions.length;i++){
        if (key==searchOptions[i].param){
          return searchOptions[i];
        }
      }
    }
    return null;
  };

  let appendSearchOption = (where,options,value)=>{
    let attributes = options.attributes||[];
    let operator = options.operator||'%eq';
    attributes.forEach((attr)=>{
      let obj = {}
      obj[attr]={}
      obj[attr][operator]=value;
      where.$and.push(obj);
    });
  };

  let getOrderingArray = (arrParams)=>{
    return arrParams.map((param)=>{
      if (param.charAt(0)=="-"){
        return [sequelize.fn('max', sequelize.col(param)), 'DESC'];
      }
      return [sequelize.fn('max',  sequelize.col(param))];
    });
  };
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

  let makeArray = (variable)=>{
    return ((variable)?((Array.isArray(variable))?variable:[variable]):[]);
  };

  let initQuery = (options)=>{
    let obj ={
      attributes: options.attributes,
      order:options.order,
      where:{
        $and:[]
      },
    }
    obj = JSON.parse(JSON.stringify(obj));
    obj.include=makeArray(options.include);
    return obj;
  };

  let getAttributesArray = (model)=>{
    let arr =[];
    Object.keys(model.rawAttributes).forEach((key)=>{
      arr.push(key);
    })
    return arr;
  };
  let endpointById = (endpoint)=>{
    return path.normalize(endpoint)+":id"
  };
  let fabricateQuery = (req,options)=>{
    let query = initQuery(options);
    let page,count,scope,model=options.model;
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
        case 'count':
          count=parseInt(value);
          return;
        break;
        case 'scope':
          scope=value;
          return;
        break;
      }
      let searchOption = findSearchOption(key,options.search);
      if (searchOption){
        appendSearchOption(query.where,searchOption,value);
      }
    });
    if (page!=null){
      count = count||50;
      query.offset = page*count;
      query.limit = count;
    }
    if (scope){
      model = model.scope(scope);
    }
    return {query:query,model:model};
  };

  return {
		init:init,
    fabricateQuery:fabricateQuery,
    normalizeOptions:normalizeOptions
	};

})();
module.exports = resourceCreator;
