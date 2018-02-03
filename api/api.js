const bodyParser = require('body-parser');
const resourceCreator = require('./resourceCreator/resourceCreator');
const associatedResourceCreator = require('./resourceCreator/associatedResourceCreator');
var api = (function(){

  var createResource = (options)=>{
    return resourceCreator.createResource(options);
  }
  var createAssociatedResource = (options)=>{
    return associatedResourceCreator.createResource(options);
  }
  return {
    createResource:createResource,
    createAssociatedResource:createAssociatedResource
	};

})();

module.exports = api;
