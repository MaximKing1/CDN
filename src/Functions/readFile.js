module.exports = (remoteFilename) => {
  let bucketName = process.env.bucketName;
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
