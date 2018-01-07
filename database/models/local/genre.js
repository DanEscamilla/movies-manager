'use strict';
module.exports = (sequelize, DataTypes) => {
  let genre = sequelize.define('genre', {
    name:{
      type:DataTypes.STRING,
      allowNull:false
    }
  });
  genre.associate= function(models) {
    genre.belongsToMany(models.movie,{
      through:'genre_movie'
    });
  };
  return genre;
};
