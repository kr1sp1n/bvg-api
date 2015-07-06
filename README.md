BVG API
===================

An inofficial API to the BVG (Berlin Transport Services) written in Coffeescript.

[Demo](https://bvg-api.herokuapp.com/station?input=Alexanderplatz)

__Dependencies__

* [request](https://github.com/request/request) to fetch HTML from http://mobil.bvg.de
* [cheerio](https://github.com/cheeriojs/cheerio) to extract data from the HTML DOM tree
* [restify](https://github.com/mcavage/node-restify) to serve the extracted data via REST API


Install
-------------------

    git clone git@github.com:kr1sp1n/bvg-api.git
    cd bvg-api
    npm install

Run
-------------------

    npm start


Develop
-------------------

Watch for changes and restart server automatically:

    gulp develop
