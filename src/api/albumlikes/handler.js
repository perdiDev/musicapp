const autoBind = require('auto-bind');

class AlbumLikesHandler {
  constructor(service, albumsService) {
    this._service = service;
    this._albumsService = albumsService;

    autoBind(this);
  }

  async postAlbumLikesByAlbumIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._albumsService.getAlbumById(id);
    await this._service.checkAlbumLikes(id, credentialId);
    await this._service.addAlbumLikes(id, credentialId);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil di-like',
    });
    response.code(201);
    return response;
  }

  async deleteAlbumLikesByAlbumIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.deleteAlbumLikes(id, credentialId);

    return {
      status: 'success',
      message: 'Album berhasil di-unlike',
    };
  }

  async getAlbumLikesByAlbumIdHandler(request, h) {
    const { id } = request.params;
    const [likes, cache] = await this._service.getAlbumLikes(id);

    const response = h.response({
      status: 'success',
      data: {
        likes: parseInt(likes, 10),
      },
    });
    if (cache) {
      response.header('X-Data-Source', 'cache');
    }
    return response;
  }
}

module.exports = AlbumLikesHandler;
