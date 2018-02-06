'use strict';
let fs = require('fs');

var isDirectory=function(path){
  try{
    fs.readdirSync(path);
    return true;
  } catch(err){
    return false;
  }
}

module.exports = (sequelize, DataTypes) => {

  let collection = sequelize.define('collection', {
    name:{
      type: DataTypes.STRING,
      allowNull:false,
      unique:true,
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
        },
        isPath(path){
          if (!isDirectory(path)){
            throw new Error('Not a valid path');
          }
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
