const config = require('../../config');

module.exports = (remoteFilename) => {
  let bucketName = config.bucketName;
  let downloadedFilePath = '/temp';
  global.wasabi
    .downloadFile(bucketName, remoteFilename, downloadedFilePath)
    .then((resp) => {
      if (resp.status === 200) {
        console.log(resp.message);
      }
    })
    .catch((resp) => {
      if (resp.status === 400) {
        console.error(resp.message);
      }
    });
};
