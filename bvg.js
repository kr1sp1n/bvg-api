this.title = "Welcome to the inofficial bvg webservice!";
this.name = "bvg api module";
this.version = "0.0.1";
this.endpoint = "http://bvg-api.herokuapp.com";

var get = require('get');
var util = require('util'),
    jjw = require('jjw');

// you can pass an object -- will return an object with the results matching these keys
/*
var scrapers = {
	stations: function($) {
		var arr = []
		$('select.ivu_selectbox option').each(function() {
			arr.push($(this).attr('value'));
		});
		return arr;
	}
};
*/

exports.stations = function(options, callback){
	//http://mobil.bvg.de/IstAbfahrtzeiten/index/mobil?input=Stromstr.+%28Berlin%29
	
	//console.log(escape(options.input));
	
	var url = 'http://mobil.bvg.de/IstAbfahrtzeiten/index/mobil?input='+escape(options.input),
	    dl = new get(url);
	
	dl.asBuffer(function(err, data) {
	    if (err) throw err;
	
		// convert from ISO-8859-1 to UTF-8
		var Iconv  = require('iconv').Iconv;
		var iconv = new Iconv('ISO-8859-1', 'UTF-8');
		var buffer = iconv.convert(data);
		
		// do something useful with the buffer
		
		var scrapers = {
			choices: function($) {
				var arr = [];
				$('select.ivu_selectbox option').each(function() {
					arr.push($(this).attr('value'));
				});
				return arr;
			},
			stations: function($) {
				/*
				var obj = {};
				obj.results = [];
				obj.status = "";
				*/
				var stations = [];
				$('.ivu_result_box').each(function(){
					if($(this).attr('id')!='ivuStreckeninfos') {
						$(this).find('.ivu_table').each(function(){
							var station = {};
							stations.push(station);
							station.id = $(this).find('thead tr th').text().match(/Mast:[\s]*(\w*)/)[1];
							station.departures = [];
							$(this).find('tbody tr').each(function(){
								var departure = {};
								departure.time = $(this).find('.ivu_table_c_dep').text().replace(/\s/g, "");
								departure.line = $.trim($(this).find('.ivu_table_c_line').text());
								departure.direction = $.trim($(this).find('.catlink').text());
								station.departures.push(departure);
							});
							
						});
					} else {
						//obj.status = $.trim($(this).text());
					}
				});
				return stations;
			}
		};

        var page = buffer.toString('utf8', 0, buffer.length);

		//console.log(page);

		jjw(page, scrapers, function(err, result) {
		  if (err) throw err;
	      callback(null, result);
		});
	});	
};

exports.stations.description = "Show list of found stations."
exports.stations.schema = {
	input: {
		type: 'string',
		optional: false
	}
}