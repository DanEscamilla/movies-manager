'use strict';
module.exports = (sequelize, DataTypes) => {

  var imdbMovie = sequelize.define('imdb_movie', {
    id:{
      type: DataTypes.STRING,
      allowNull:false,
      primaryKey:true
    },
    prim_title:{
      type:DataTypes.STRING,
      allowNull:false
    },
    orig_title:DataTypes.STRING,
    year:DataTypes.INTEGER,
    duration:DataTypes.INTEGER,
    rating:DataTypes.FLOAT
  }, {
    timestamps:false,
    classMethods: {
      associate: function(models) {
        models.imdbMovie.belongsToMany(models.genre,{
          through:'genre_movie'
        });
      }
    }
  });
  return imdbMovie;
};
