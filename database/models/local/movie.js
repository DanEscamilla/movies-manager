'use strict';
module.exports = (sequelize, DataTypes) => {

  let movie = sequelize.define('movie', {
    name:{
      type: DataTypes.STRING,
      allowNull:false
    },
    duration:DataTypes.INTEGER,
    year:DataTypes.INTEGER,
    status:{
      type:DataTypes.ENUM('IN-PROGRESS','NEW','FINISHED','UNSEEN'),
      defaultValue:'NEW'
    },
    path:{
      type:DataTypes.TEXT,
      allowNull:false
    },
    rating:DataTypes.FLOAT,
    imdbId:DataTypes.STRING,
    filename:DataTypes.STRING,
    lastPlayTime:{
      type:DataTypes.FLOAT,
      defaultValue: 0
    },
    lastSeenDate:{
      type:DataTypes.DATE
    }
  });

  movie.associate = function(models) {
    movie.belongsToMany(models.genre,{
      through:'movie_genre'
    });
  };
  return movie;
};
