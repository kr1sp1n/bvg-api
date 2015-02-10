# file: src/server.coffee

restify = require 'restify'
api = require "#{__dirname}/api"

server = restify.createServer
  name: api.info().name
  version: api.info().version

server.use restify.queryParser()
server.use restify.jsonp()
server.use restify.bodyParser()

server.get '/', (req, res, next)->
  res.json api.info()
  next()

server.get '/station', (req, res, next)->
  api.getStations req.params, (err, stations)->
    res.json stations

server.get '/station/:id', (req, res, next)->
  api.getStation req.params, (err, station)->
    res.json [station]

module.exports = server
