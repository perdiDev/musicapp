const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class ActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addActivity(playlistId, songId, userId, action) {
    const id = `activity-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const query = {
      text: 'INSERT INTO activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, createdAt],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Aktifitas playlist gagal ditambahkan');
    }
  }

  async getActivities(id) {
    const query = {
      text: `SELECT users.username, songs.title, activities.action, activities.time
        FROM activities
        RIGHT JOIN users ON users.id=activities.user_id
        RIGHT JOIN songs ON songs.id=activities.song_id
        WHERE activities.playlist_id=$1
        ORDER BY activities.time ASC`,
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Aktifitas playlist tidak ditemukan');
    }

    return result.rows;
  }

  async deleteActivities(id) {
    const query = {
      text: 'DELETE FROM activities WHERE playlist_id=$1',
      values: [id],
    };
    await this._pool.query(query);
  }
}

module.exports = ActivitiesService;
