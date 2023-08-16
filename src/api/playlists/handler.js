const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePostPlaylistPayload(request.payload);

    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._service.addPlaylist({ name, owner: credentialId });

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getPlaylists(credentialId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._service.deletePlaylistById(id);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postPlaylistSongByIdHandler(request, h) {
    this._validator.validatePostPlaylistSongPayload(request.payload);

    const { songId } = request.payload;
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistSongAccess(id, credentialId);
    await this._service.postPlaylistSong(id, songId);

    const response = h.response({
      status: 'success',
      message: 'Playlist song berhasil ditambahkan',
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistSongAccess(id, credentialId);
    const playlist = await this._service.getPlaylistById(id);
    const songs = await this._service.getPlaylistSongById(id);

    return {
      status: 'success',
      data: {
        playlist: {
          ...playlist,
          songs,
        },
      },
    };
  }

  async deletePlaylistSongByIdHandler(request) {
    this._validator.validateDeletePlaylistSongPayload(request.payload);
    const { songId } = request.payload;
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistSongAccess(id, credentialId);
    await this._service.deletePlaylistSongById(id, songId);

    return {
      status: 'success',
      message: 'Playlist song berhasil dihapus',
    };
  }
}

module.exports = PlaylistsHandler;
