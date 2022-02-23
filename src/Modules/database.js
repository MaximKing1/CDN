const s3 = require('../S3Functions/index');
const mongodb = require('mongoose');

module.exports = async (app) => {
  if (process.env.files == 's3') {
    if (process.env.s3Provider == 's3compatible') {
      global.s3 = new s3(process.env.s3Provider, {
        endpoint: process.env.endpoint,
        accessKeyId: process.env.accessKeyID,
        secretAccessKey: process.env.secretAccessKey,
      });
    } else {
      global.s3 = new s3(process.env.s3Provider, {
        accessKeyId: process.env.accessKeyID,
        secretAccessKey: process.env.secretAccessKey,
      });
    }
  }
};
