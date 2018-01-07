'use strict';
module.exports = (sequelize, DataTypes) => {
  var genre = sequelize.define('genre', {
    name:{
      type:DataTypes.STRING,
      allowNull:false
    }
  }, {
    classMethods: {
      associate: function(models) {

        models.genre.belongsToMany(models.movie,{
          through:'genre_movie'
        });
      }
    }
  });
  return genre;
};
