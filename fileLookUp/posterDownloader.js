var request = require('request'),
	fs = require('fs'),
	cheerio = require('cheerio');

var posterDownloader = (function(){

	let filename = "";
	const prefix = "thumbnail-";
	const extension = ".jpg";

  var download = function(movie,callback){
		return new Promise((resolve,reject)=>{
			let path = normalizePath(movie.path);
			filename = prefix+movie.id+extension;
			let imdbid = movie.imdbid;
			if (!imdbid){
				reject(new Error("No imdbid for this movie"));
			}
			if (checkIfPosterExists(path)){
				resolve({message:"Poster already exists."});
				return;
			}
      let url = getURL(imdbid);
  		request(encodeURI(url),function(err,resp,body){
  			if (!err && resp.statusCode == 200){
  				var $ = cheerio.load(body);
  				// console.log($('#1970s').parent().nextAll().first().children());
          let urlImage = scrapPosterURL($);
          downloadImage(urlImage, path+filename, function(err){
						if (err){
								reject(err);
						} else {
	            resolve({message:"Downloaded successfully."});
						}
          });
  			} else {
					reject(err);
				}
  		});
		});
  };
	var normalizePath = function(path){
		if (path.charAt(path.length-1) != "/") {
        path+="/";
    }
		return path;
	}

	var checkIfPosterExists = function(path){
		path = normalizePath(path);
		let items = fs.readdirSync(path);
		let exists = false;
		for (let i=0;i<items.length;i++){
			if (items[i]===filename)
				exists=true;
		}
		return exists;
	}

  var downloadImage = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };

  var scrapPosterURL = function($){
    return $('.poster img').attr('src');
  }

  var getURL = function(imdbid){
    return "http://www.imdb.com/title/"+imdbid;
  };

  return {
    download:download,
		checkIfPosterExists:checkIfPosterExists
  };

})();
module.exports = posterDownloader;
