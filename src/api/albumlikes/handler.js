const autoBind = require('auto-bind');

class AlbumLikesHandler {
  constructor(service) {
    this._service = service;

    autoBind(this);
  }

  async postAlbumLikesByAlbumIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

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
    const { id: credentialId } = request.auth.params;

    await this._service.deleteAlbumLikes(id, credentialId);

    return {
      status: 'success',
      message: 'Album berhasil di-unlike',
    };
  }

  async getAlbumLikesByAlbumIdHandler(request) {
    const { id } = request.params;
    const likes = await this._service.getAlbumLikes(id);

    return {
      status: 'success',
      data: {
        likes,
      },
    };
  }
}

module.exports = AlbumLikesHandler;
