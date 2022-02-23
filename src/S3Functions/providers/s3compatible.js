const AWS = require("aws-sdk");
const { AwsWrapper } = require("./aws");

function getS3Compatible(options) {
  const endpoint = new AWS.Endpoint(options.endpoint);
  const s3Compatible = new AWS.S3({
    endpoint: endpoint,
    accessKeyId: options.accessKeyId,
    secretAccessKey: options.secretAccessKey
  });

  return new AwsWrapper(s3Compatible);
}

module.exports = {
  getS3Compatible
};
