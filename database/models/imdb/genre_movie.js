'use strict';
module.exports = (sequelize, DataTypes) => {
  var genre_movie = sequelize.define('genre_movie', {
  }, {
    timestamps:false,
    freezeTableName:true
  });

  return genre_movie;
};
