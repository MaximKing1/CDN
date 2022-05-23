module.exports = async (app) => {
  let bucketName = 'example';
  let remoteFilename = 'file.bin';
  let downloadedFilePath = '/tmp';
  global.s3
    .downloadFile(bucketName, remoteFilename, downloadedFilePath)
    .then((resp) => {
      if (resp.status === 200) {
        console.log(resp.message);
      }
    })
    .catch((resp) => {
      if (resp.status === 400) {
        console.log(chalk.red('[ WASABI S3 ]'), resp.message);
      }
    });
};
