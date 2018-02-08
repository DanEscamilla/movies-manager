const moment = require('moment');

function initScripts(localDB){
  const Op = localDB.sequelize.Op;

  let query={
    where:{
      status:"2-NEW",
      createdAt:{
        [Op.lt]: moment().subtract({'days':3}).toDate(),
      }
    }
  }
  localDB.movie.update({status:'3-UNSEEN'},query);

}

module.exports = initScripts;
