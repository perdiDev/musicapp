const InvariantError = require('../../exceptions/InvariantError');
const { SongsSchemaPayload } = require('./schema');

const SongValidator = {
  validateSongPayload: (payload) => {
    const validationResult = SongsSchemaPayload.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = SongValidator;
