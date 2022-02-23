const config = require('./../config.slave.js');

module.exports = (remoteFilename) => {
  let bucketName = config.bucketName;
  global.s3
    .readFile(bucketName, remoteFilename)
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
