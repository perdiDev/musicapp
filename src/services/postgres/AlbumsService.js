const { Pool } = require('pg');

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }
}
