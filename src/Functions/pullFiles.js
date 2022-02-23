const config = require('./../config.slave.js');
const chalk = require('chalk');

module.exports = (app) => {
  if (config.files == 'local') {
    // Run Local Script
  } else if (config.files == 's3') {
    let bucketName = 'example';
    let remoteFilename = 'file.bin';
    let downloadedFilePath = '/tmp';
    global.wasabi
      .downloadFile(bucketName, remoteFilename, downloadedFilePath)
      .then((resp) => {
        if (resp.status === 200) {
          console.log(resp.message);
          // Output: Bucket "example" was deleted successfully
        }
      })
      .catch((resp) => {
        if (resp.status === 400) {
           console.log(chalk.red('[ WASABI S3 ]'), resp.message);
        }
      });
  }
};
