const cheerio = require('cheerio');
const request = require('request');
const parse = require('csv-parse');
const fs = require('fs');

const client = request.defaults({
  url: 'http://mobil.bvg.de/Fahrinfo/bin/stboard.bin/eox'
});
const version = '0.1.0';
const endpoint = process.env.API_ENDPOINT || 'http://localhost:3000';

const csv_data = fs.readFileSync(`${__dirname}/../stops.txt`);

let locations = {};

parse(csv_data, { columns: true, objname: 'stop_id' }, (err, output) => {
  if (err) console.error(err); // eslint-disable-line
  locations = output;
});

const loadBody = (body) => {
  const $ = cheerio.load(body, { normalizeWhitespace: true });
  return $;
};

const getLocation = (station_id) => {
  const s = locations[station_id];
  if (s) {
    return { lat: s.stop_lat, lon: s.stop_lon };
  }
};

const api = {
  info() {
    const info = {
      name: 'BVG API',
      version,
    };
    return info;
  },

  getResources() {
    return api.resources;
  },

  getStation(params, done) {
    const query = {
      input: params.id,
      boardType: params.realtime ? 'depRT' : 'dep',
      time: params.time,
      date: params.date,
      // maxJourneys: 10,
      start: 'yes',
    };
    client({
      method: 'GET',
      qs: query,
    }, (err, res, body) => {
      if (err) return done(err);
      const station = {};
      const $ = loadBody(body);
      station.id = params.id;
      station.name = $('#ivu_overview_input strong').first().text().trim();
      station.href = `${endpoint}/station/${params.id}`;
      station.location = getLocation(station.id);
      const departures = [];
      $('.ivu_result_box .ivu_table tr').slice(1).each((i, elem) => {
        const d = {};
        const el = $(elem);
        const tds = el.find('td');
        d.date = $('#ivu_overview_input').contents().eq(3).text().split(':')[1].trim();
        d.time = $(tds[0]).text().trim();
        d.line = $(tds[1]).find('a strong').first().text().trim();
        d.direction = $(tds[2]).text().trim();
        departures.push(d);
      });
      station.departures = departures;
      done(null, station);
    });
  },

  getStations(params, done) {
    // get id from href attr of elem
    const re = /&input=(\w*)/;
    client.post({ form: params }, (err, res, body) => {
      if (err) return done(err);
      const stations = [];
      const $ = loadBody(body);
      $('.select a').each((i, elem) => {
        const el = $(elem);
        const href = el.attr('href');
        const m = re.exec(href);
        const id = m[1];
        const station = {
          id: id,
          name: el.text().trim(),
          href: `${endpoint}/station/${id}`,
          location: getLocation(id),
        };
        stations.push(station);
      });

      done(null, stations);
    });
  }
};

module.exports = api;
