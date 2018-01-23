'use strict';
module.exports = (sequelize, DataTypes) => {

  let collection = sequelize.define('collection', {
    name:{
      type: DataTypes.STRING,
      primaryKey:true,
      validate:{
        notEmpty:{
          msg:"Name cannot be empty"
        }
      }
    },
    path:{
      type:DataTypes.TEXT,
      allowNull:false,
      validate:{
        notEmpty:{
          msg:"Path cannot be empty"
        }
      }
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
