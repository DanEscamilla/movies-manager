'use strict';
module.exports = (sequelize, DataTypes) => {

  let movie = sequelize.define('movie', {
    name:{
      type: DataTypes.STRING,
      allowNull:false
    },
    duration:DataTypes.INTEGER,
    year:{
      type:DataTypes.INTEGER,
      validate:{
        isInt:{
          args:true,
          msg:"Must be Integer"
        }
      }
    },
    status:{
      type:DataTypes.ENUM('IN-PROGRESS','NEW','UNSEEN','FINISHED'),
      defaultValue:'NEW'
    },
    path:{
      type:DataTypes.TEXT,
      allowNull:false
    },
    rating:{
      type:DataTypes.FLOAT,
      validate:{
        isFloat:{
          args:true,
          msg:"Must be a Float"
        }
      }
    },
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

    movie.addScope('withGenres',{
      include:[{
        model:models.genre,
      }]
    });

  };
  return movie;
};
