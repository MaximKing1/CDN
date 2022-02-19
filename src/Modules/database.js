const WasabiS3 = require('wasabi-s3');
const config = require('../../config');

module.exports = async (app) => {
  global.wasabi = new WasabiS3('wasabi', {
    accessKeyId: config.accessKeyID,
    secretAccessKey: config.secretAccessKey,
  });
};
