var fs = require('fs')

var nameFinder = (function(){

  let initialPath;

  var find = function(initialPath,name){
    return new Promise(function(resolve,reject){
      resolve(findVideos([],initialPath,name));
    })
  };

  var findVideos = function(arr,path,name){
      let files = fs.readdirSync(path);
      for (let i=0; i<files.length; i++) {
          var fileInfo = fs.statSync(path+'/'+files[i]);
          if (fileInfo.isDirectory()){
            var dir = findVideos(arr,path+'/'+files[i],files[i]);
          } else {
            let video = isVideo(files[i]);
            if (video){
              arr.push({name:video[0],path:path,filename:files[i]});
            }
          }
      }
      return arr;
  };

  var isVideo = (name)=>{
    return name.match(/^.*(?=\.(avi|wmv|flv|mpg|mp4|mkv)$)/gi);
  };

	return {
		find:find
	};

})();


module.exports = nameFinder;
