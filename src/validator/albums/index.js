const InvariantError = require('../../exceptions/InvariantError');
const { AlbumPayloadSchema, PostAlbumCoversPayloadSchema } = require('./schema');

const AlbumValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePostAlbumCoverPayload: (headers) => {
    const validationResult = PostAlbumCoversPayloadSchema.validate(headers);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AlbumValidator;
