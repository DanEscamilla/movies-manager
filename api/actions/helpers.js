
function camelize(str) {
  return str.replace(/\W+(.)/g, function(match, chr)
  {
    return chr.toUpperCase();
  });
}

module.exports = {
  getPK:(model)=>{
    return model.describe().then(function (schema) {
        let PK = Object.keys(schema).filter(function(field){
            return schema[field].primaryKey;
        });
        return PK[0];
    })
  },
  findOrCreate: async function(objs,options){
    let instances = [];
    let query = {where:null};
    for (let obj of objs){
      query.where=obj;
      instances.push(await options.model.findOrCreate(query).then(instanceArray=>instanceArray[0]));
    }
    return instances;
  },
  buildFunctionName:function(core,modelName,plural){
    return camelize(core+" "+modelName+((plural)?'s':''));
  },
  camelize:camelize,
}
