const moment = require('moment');

function initScripts(localDB){
  const Op = localDB.sequelize.Op;

  let query={
    where:{
      status:"NEW",
      createdAt:{
        [Op.lt]: moment().subtract({'days':3}).toDate(),
      }
    }
  }
  localDB.movie.update({status:'UNSEEN'},query);

}

module.exports = initScripts;
