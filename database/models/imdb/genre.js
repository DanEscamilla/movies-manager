'use strict';
module.exports = (sequelize, DataTypes) => {
  var genre = sequelize.define('genre', {
    name:{
      type:DataTypes.STRING,
      allowNull:false
    }
  }, {
    timestamps:false,
    classMethods: {
      associate: function(models) {
        models.genre.belongsToMany(models.imdbMovie,{
          through:'genre_movie'
        });
      }
    }
  });
  return genre;
};
