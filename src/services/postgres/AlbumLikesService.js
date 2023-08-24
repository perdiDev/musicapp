const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbumLikes(albumId, userId) {
    const id = `likes-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, albumId, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Likes gagal ditambahkan');
    }

    await this._cacheService.delete(`likes:${albumId}`);
  }

  async checkAlbumLikes(albumId, userId) {
    const query = {
      text: 'SELECT id FROM album_likes WHERE album_id=$1 AND user_id=$2',
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);
    if (result.rowCount > 0) {
      throw new InvariantError('Album sudah di-like oleh user');
    }
  }

  async getAlbumLikes(albumId) {
    try {
      const likes = await this._cacheService.get(`likes:${albumId}`);
      return [likes, true];
    } catch (error) {
      const query = {
        text: 'SELECT COUNT(*) as likes FROM album_likes WHERE album_id=$1',
        values: [albumId],
      };

      const result = await this._pool.query(query);
      const { likes } = result.rows[0];

      await this._cacheService.set(`likes:${albumId}`, likes);
      return [likes, false];
    }
  }

  async deleteAlbumLikes(albumId, userId) {
    const query = {
      text: 'DELETE FROM album_likes WHERE album_id=$1 AND user_id=$2',
      values: [albumId, userId],
    };
    await this._pool.query(query);
    await this._cacheService.delete(`likes:${albumId}`);
  }
}

module.exports = AlbumLikesService;
