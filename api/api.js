const bodyParser = require('body-parser');
const resourceCreator = require('./resourceCreator');
var api = (function(){

  var createResource = (options)=>{
    return resourceCreator.createResource(options);
  }
  
  return {
      createResource:createResource
	};

})();

module.exports = api;
