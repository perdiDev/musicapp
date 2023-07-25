const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: handler.postAlbumsHansler,
  },
  {
    method: 'GET',
    path: '/albums',
    handler: handler.getAlbumByIdHandler,
  },
  {
    method: 'PUT',
    path: '/albums',
    handler: handler.putAlbumByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/albums',
    handler: handler.deleteAlbumByIdHandler,
  },
];

module.exports = routes;
