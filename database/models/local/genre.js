'use strict';
// const Op = Sequelize.Op;

module.exports = (sequelize, DataTypes) => {
  let genre = sequelize.define('genre', {
    name:{
      type:DataTypes.STRING,
      allowNull:false,
      unique:true
    }
  });
  genre.associate= function(models) {
    genre.belongsToMany(models.movie,{
      through:'movie_genre'
    });
    genre.addScope('relevant',{
      include:[{
        model:models.movie,
        where:{
          id:{
            $gt:0
          }
        },
        attributes:[]
      }]
    });
  };
  return genre;
};
