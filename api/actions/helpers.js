
module.exports = {
  getPK:(model)=>{
    return model.describe().then(function (schema) {
        let PK = Object.keys(schema).filter(function(field){
            return schema[field].primaryKey;
        });
        return PK[0];
    })
  }
}
