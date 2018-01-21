'use strict';
module.exports = (sequelize, DataTypes) => {

  let collection = sequelize.define('collection', {
    name:{
      type: DataTypes.STRING,
      primaryKey:true
    },
    path:{
      type:DataTypes.TEXT,
      allowNull:false
    },
    description:{
      type:DataTypes.TEXT
    }
  });

  collection.associate = function(models) {
    collection.hasMany(models.movie);
  };
  return collection;
};
