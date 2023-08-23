const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumLikesService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbumLikes(albumId, userId) {
    const id = `likes-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO album_likes VALUES($1, $2) RETURNING id',
      values: [id, albumId, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Likes gagal ditambahkan');
    }
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
    const query = {
      text: 'SELECT COUNT(*) as jumlah_likes FROM album_likes WHERE album_id=$1',
      values: [albumId],
    };

    const result = await this._pool.query(query);
    console.log(result.rows);
    return result.rows.jumlah_likes;
  }

  async deleteAlbumLikes(albumId, userId) {
    const query = {
      text: 'DELETE FROM album_likes WHERE album_id=$1 AND user_id=$2',
      values: [albumId, userId],
    };
    await this._pool.query(query);
  }
}

module.exports = AlbumLikesService;
