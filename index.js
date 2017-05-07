const server = require('./src/server');

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('%s listening at %s', server.name, server.url); // eslint-disable-line
});
