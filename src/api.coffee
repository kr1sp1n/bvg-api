# file: src/api.coffee

cheerio = require 'cheerio'
request = require 'request'

client = request.defaults
  url: "http://mobil.bvg.de/Fahrinfo/bin/stboard.bin/eox"
version = "0.1.0"
endpoint = process.env.API_ENDPOINT or "http://localhost:3000"


loadBody = (body)->
  $ = cheerio.load body, normalizeWhitespace: true
  return $

api =
  info: ->
    info =
      name: 'BVG API'
      version: "0.1.0"
    return info

  getResources: ->
    return api.resources

  getStation: (params, done)->
    query =
      input: params.id
      boardType: 'dep'
      time: params.time
      date: params.date
      # maxJourneys: 10
      start: 'yes'
    client
      method: 'GET'
      qs: query
    , (err, res, body)->
      return done err if err
      station = {}
      $ = loadBody body
      station.id = params.id
      station.name = $('#ivu_overview_input strong').first().text().trim()
      station.href = "#{endpoint}/station/#{params.id}"
      departures = []
      $('.ivu_result_box .ivu_table tr').slice(1).each (i, elem)->
        d = {}
        el = $(elem)
        tds = el.find('td')
        d.date = $('#ivu_overview_input').contents().eq(3).text().split(':')[1].trim()
        d.time = $(tds[0]).text().trim()
        d.line = $(tds[1]).find('a strong').first().text().trim()
        d.direction = $(tds[2]).text().trim()
        departures.push d
      station.departures = departures
      done null, station

  getStations: (params, done)->
    # get id from href attr of elem
    re = /&input=(\w*)/
    client.post form: params, (err, res, body)->
      return done err if err
      stations = []
      $ = loadBody body
      $('.select a').each (i, elem)->
        el = $(elem)
        href = el.attr('href')
        m = re.exec(href)
        id = m[1]
        station =
          id: id
          name: el.text().trim()
          href: "#{endpoint}/station/#{id}"
        stations.push station

      done null, stations


module.exports = api
