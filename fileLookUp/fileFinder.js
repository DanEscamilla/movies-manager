var Fs = require('fs');
var Path = require('path');

var nameFinder = (function(){

  let initialPath;

  var find = function(path){
    return new Promise(function(resolve,reject){
      initialPath = path;
      resolve(findVideos([],initialPath));
    })
  };

  var findVideos = function(arr,path){
      let files = Fs.readdirSync(path);
      for (let i=0; i<files.length; i++) {
          var fileInfo = Fs.statSync(path+'/'+files[i]);
          if (fileInfo.isDirectory()){
            var dir = findVideos(arr,path+'/'+files[i],files[i]);
          } else {
            let video = isVideo(files[i]);
            if (video){
              arr.push({name:video[0],path:Path.relative(initialPath,path),filename:files[i]});
            }
          }
      }
      return arr;
  };

  var isDirectory=function(path){
    console.log("dafuq");
    try{
      Fs.readdirSync(path);
      return true;
    } catch(err){
      return false;
    }
  }

  var isVideo = (name)=>{
    return name.match(/^.*(?=\.(avi|wmv|flv|mpg|mp4|mkv)$)/gi);
  };

	return {
		find:find,
    isDirectory:isDirectory
	};

})();


module.exports = nameFinder;
