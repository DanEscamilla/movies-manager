'use strict';
module.exports = (sequelize, DataTypes) => {

  let collection = sequelize.define('collection', {
    name:{
      type: DataTypes.STRING,
      allowNull:false
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
