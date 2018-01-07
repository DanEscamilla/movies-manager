'use strict';
module.exports = (sequelize, DataTypes) => {

  var movie = sequelize.define('movie', {
    name:{
      type: DataTypes.STRING,
      allowNull:false
    },
    duration:DataTypes.INTEGER,
    year:DataTypes.INTEGER,
    seen:DataTypes.BOOLEAN,
    path:{
      type:DataTypes.TEXT,
      allowNull:false
    },
    rating:DataTypes.FLOAT,
    imdbid:DataTypes.STRING,
    filename:DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        models.movie.belongsToMany(models.genre,{
          through:'genre_movie'
        });
      }
    }
  });
  return movie;
};
