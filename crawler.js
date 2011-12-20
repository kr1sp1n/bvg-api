var get = require('get');

var dl = new get('http://mobil.bvg.de/IstAbfahrtzeiten/index/mobil?input=stral').asBuffer(function(err, data) {
    if (err) throw err;
    console.log(data);
});

/*
var util = require('util'),
    jjw = require('jjw')

// you can pass an object -- will return an object with the results matching these keys
var scrapers = {
  scripts: function($) {
    var arr = [], src
    $('script').each(function() {
      src = $(this).attr('src')
      if (src) arr.push(src)
    })
    return arr
  }
, thumbs: function($) {
    var arr = []
    $('.pc_img').each(function() {
      arr.push($(this).attr('src'))
    })
    return arr
  }
, results: function($) {
    return $('.Results').text()
  }
}

jjw('http://www.flickr.com/search/?q=homer+simpson', scrapers, function(err, res) {
  if (err) throw err
  console.log(res)
});
*/
