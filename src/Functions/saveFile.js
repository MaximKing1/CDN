const config = require('./../config.slave.js');

module.exports = () => {
  let bucketName = config.bucketName;
  let filePath = './tmp';
  global.s3
    .uploadFile(bucketName, filePath)
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
