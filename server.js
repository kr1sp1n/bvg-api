var webservice = require('webservice'),
    bvg        = require('./bvg'),
    port = process.env.PORT || 3000;

webservice.createServer(bvg).listen(port);
console.log('BVG json webservice started on port '+port);