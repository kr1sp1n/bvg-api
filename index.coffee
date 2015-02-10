# file: index.coffee

server = require "#{__dirname}/src/server"

port = process.env.PORT or 3000

server.listen port, ->
  console.log '%s listening at %s', server.name, server.url
