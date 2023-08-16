const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(playlistsService, activitiesService, validator) {
    this._playlistsService = playlistsService;
    this._activitiesService = activitiesService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePostPlaylistPayload(request.payload);

    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._playlistsService.addPlaylist({ name, owner: credentialId });

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
    const playlists = await this._playlistsService.getPlaylists(credentialId);

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

    await this._playlistsService.verifyPlaylistOwner(id, credentialId);
    await this._playlistsService.deletePlaylistById(id);

    await this._activitiesService.deleteActivities(id);

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

    await this._playlistsService.verifyPlaylistSongAccess(id, credentialId);
    await this._playlistsService.postPlaylistSong(id, songId);

    await this._activitiesService.addActivity(id, songId, credentialId, 'add');

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

    await this._playlistsService.verifyPlaylistSongAccess(id, credentialId);
    const playlist = await this._playlistsService.getPlaylistById(id);
    const songs = await this._playlistsService.getPlaylistSongById(id);

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

    await this._playlistsService.verifyPlaylistSongAccess(id, credentialId);
    await this._playlistsService.deletePlaylistSongById(id, songId);

    await this._activitiesService.addActivity(id, songId, credentialId, 'delete');

    return {
      status: 'success',
      message: 'Playlist song berhasil dihapus',
    };
  }

  async getPlaylistActivities(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistSongAccess(playlistId, credentialId);
    const activities = await this._activitiesService.getActivities(playlistId);

    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    };
  }
}

module.exports = PlaylistsHandler;
