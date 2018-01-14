const bodyParser = require('body-parser');
const resourceCreator = require('./resourceCreator');
var api = (function(){

  let db;
  var init = function(db){
    resourceCreator.init(db);
  }
  var createResource = (options)=>{
    return resourceCreator.createResource(options);
  }
  return {
  		init:init,
      createResource:createResource
  	};

})();

module.exports = api;
