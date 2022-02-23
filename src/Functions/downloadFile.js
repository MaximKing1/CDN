module.exports = (remoteFilename) => {
  let bucketName = process.env.bucketName;
  let downloadedFilePath = '/temp';
  global.s3
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
