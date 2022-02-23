'use strict';

const awsProvider = require('./providers/aws');
const s3CompatibleProvider = require('./providers/s3compatible');
const digitalOceanProvider = require('./providers/digitalocean');
const wasabiProvider = require('./providers/wasabi');
const gcsProvider = require('./providers/gcs');
const azureProvider = require('./providers/azure');

class s3Funcs {
  constructor(provider, options) {
    if (provider === 'aws') {
      if (!options.accessKeyId || !options.secretAccessKey) {
        throw new Error({
          status: 400,
          message: 'Missing Auth options',
        });
      }
      return awsProvider.getAWS(options);
    } else if (provider === 'digitalocean') {
      if (!options.accessKeyId || !options.secretAccessKey) {
        throw new Error({
          status: 400,
          message: 'Missing Auth options',
        });
      }
      return digitalOceanProvider.getDigitalOcean(options);
    } else if (provider === 'wasabi') {
      if (!options.accessKeyId || !options.secretAccessKey) {
        throw new Error({
          status: 400,
          message: 'Missing Auth options',
        });
      }
      return wasabiProvider.getWasabi(options);
    } else if (provider === 'gcs') {
      if (!options.keyFilename) {
        throw new Error({
          status: 400,
          message: 'Missing Auth options',
        });
      }
      return gcsProvider.getGCS(options);
    } else if (provider === 'azure') {
      if (!options.accountName || !options.accountKey) {
        throw new Error({
          status: 400,
          message: 'Missing Auth options',
        });
      }
      return azureProvider.getAZURE(options);
    } else if (provider === 's3compatible') {
      if (
        !options.accessKeyId ||
        !options.secretAccessKey ||
        !options.endpoint
      ) {
        throw new Error({
          status: 400,
          message: 'Missing Auth options',
        });
      }
      return s3CompatibleProvider.getS3Compatible(options);
    } else {
      throw new Error({
        status: 400,
        message: 'Missing Auth options',
      });
    }
  }
}

module.exports = s3Funcs;
