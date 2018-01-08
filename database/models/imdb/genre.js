'use strict';
module.exports = (sequelize, DataTypes) => {
  var genre = sequelize.define('genre', {
  }, {
    timestamps:false,
  });

  genre.associate= function(models) {
    genre.belongsToMany(models.imdb_movie,{
      through:'genre_movie'
    });
  }

  return genre;
};
