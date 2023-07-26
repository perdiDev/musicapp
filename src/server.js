require('dotenv').config();

const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const AlbumService = require('./services/postgres/AlbumsService');

const init = async () => {
  const albumsService = new AlbumService();

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
      options: {
        service: albumsService,
      },
    },
  ]);

  await server.start();
  console.log(`HAVE FUN: Server berjalan pada ${server.info.uri}`);
};

init();
