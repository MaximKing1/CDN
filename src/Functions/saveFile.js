module.exports = () => {
  let bucketName = process.env.bucketName;
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
