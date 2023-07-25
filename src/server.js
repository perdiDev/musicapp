require('dotenv').config();

const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {},
    },
  ]);

  await server.start();
  console.log(`HAVE FUN: Server berjalan pada ${server.info.uri}`);
};

init();
