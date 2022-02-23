const AWS = require("aws-sdk");
const crc32 = require("fast-crc32c");
const path = require("path");
const fs = require("fs");

function getAWS(options) {
  let s3 = new AWS.S3({
    accessKeyId: options.accessKeyId,
    secretAccessKey: options.secretAccessKey,
    region: options.region || "us-east-1"
  });

  return new AwsWrapper(s3);
}

class AwsWrapper {
  constructor(s3) {
    this.s3 = s3;
    let self = this;

    self.createBucket = name => {
      if (!name) {
        return new Promise((resolve, reject) => {
          reject({
            status: 400,
            message: "Invalid parameters"
          });
        });
      }

      return new Promise((resolve, reject) => {
        self.s3.createBucket({ Bucket: name }, (err, data) => {
          if (!err) {
            resolve({
              status: 201,
              message: `Bucket "${name}" was created successfully`
            });
          } else {
            reject({
              status: 400,
              message: err.message
            });
          }
        });
      });
    };

    self.deleteBucket = name => {
      if (!name) {
        return new Promise((resolve, reject) => {
          reject({
            status: 400,
            message: "Invalid parameters"
          });
        });
      }

      return new Promise((resolve, reject) => {
        self.s3.deleteBucket({ Bucket: name }, (err, data) => {
          if (!err) {
            resolve({
              status: 200,
              message: `Bucket "${name}" was deleted successfully`
            });
          } else {
            reject({
              status: 400,
              message: err.message
            });
          }
        });
      });
    };

    self.uploadFile = (bucketName, filePath) => {
      if (!bucketName || !filePath) {
        return new Promise((resolve, reject) => {
          reject({
            status: 400,
            message: "Invalid parameters"
          });
        });
      }

      let params = {
        Bucket: bucketName,
        Key: path.basename(filePath),
        Body: fs.createReadStream(filePath)
      };
      let fileSize = fs.statSync(filePath);

      let preferredPartSize = (fileSize.size > 50000 ? 10 : 5) * 1024 * 1024;
      let options = {
        partSize: preferredPartSize,
        queueSize: 10
      };

      return new Promise((resolve, reject) => {
        self.s3.upload(params, options, (err, data) => {
          if (!err) {
            resolve({
              status: 200,
              message: `File "${filePath}" was uploaded successfully to bucket "${bucketName}"`
            });
          } else {
            reject({
              status: 400,
              message: err.message
            });
          }
        });
      });
    };

    self.downloadFile = (bucketName, filename, downloadedFilePath) => {
      if (!bucketName || !filename || !downloadedFilePath) {
        return new Promise((resolve, reject) => {
          reject({
            status: 400,
            message: "Invalid parameters"
          });
        });
      }
      let params = {
        Bucket: bucketName,
        Key: filename
      };
      let file = fs.createWriteStream(downloadedFilePath);

      return new Promise((resolve, reject) => {
        let source = self.s3.getObject(params).createReadStream();

        source.on("error", err => {
          reject({
            status: 400,
            message: err.message
          });
        });

        source.on("end", () => {
          resolve({
            status: 200,
            message: `File "${filename}" was downloaded successfully from bucket "${bucketName}"`
          });
        });

        source.pipe(file);
      });
    };

    self.createFileFromText = (
      bucketName,
      filename,
      content,
      shouldSimulateFileCorruption = false
    ) => {
      if (!bucketName || !filename || !content) {
        return new Promise((resolve, reject) => {
          reject({
            status: 400,
            message: "Invalid parameters"
          });
        });
      }

      let params = {
        Bucket: bucketName,
        Key: filename,
        Body: JSON.stringify(content)
      };
      return new Promise((resolve, reject) => {
        self.s3.putObject(params, (err, data) => {
          if (!err) {
            // Check whether file was properly uploaded
            let localFileCrc32 = crc32.calculate(params.Body);

            self.readFile(bucketName, filename).then(response => {
              let remoteFileCrc32;
              let data = JSON.stringify(response.data);
              if (shouldSimulateFileCorruption) {
                data += "corrupted-sufix";
              }
              remoteFileCrc32 = crc32.calculate(data);

              if (localFileCrc32 === remoteFileCrc32) {
                resolve({
                  status: 200,
                  message: `Object "${filename}" was saved successfully in bucket "${bucketName}"`
                });
              } else {
                reject({
                  status: 400,
                  message: `CRC32 validation error. Object "${filename}" could not be uploaded successfully`
                });
              }
            });
          } else {
            reject({
              status: 400,
              message: err.message
            });
          }
        });
      });
    };

    self.getListOfFiles = bucketName => {
      if (!bucketName) {
        return new Promise((resolve, reject) => {
          reject({
            status: 400,
            message: "Invalid parameters"
          });
        });
      }

      let params = {
        Bucket: bucketName
      };
      return new Promise((resolve, reject) => {
        self.s3.listObjectsV2(params, (err, data) => {
          if (!err) {
            let objects = [];
            data.Contents.forEach(element => {
              objects.push({
                filename: element.Key
              });
            });
            resolve({
              status: 200,
              data: objects,
              message: `The list of objects was fetched successfully from bucket "${bucketName}"`
            });
          } else {
            reject({
              status: 400,
              message: err.message
            });
          }
        });
      });
    };

    self.deleteFile = (bucketName, filename) => {
      if (!bucketName || !filename) {
        return new Promise((resolve, reject) => {
          reject({
            status: 400,
            message: "Invalid parameters"
          });
        });
      }

      let params = {
        Bucket: bucketName,
        Key: filename
      };

      return new Promise((resolve, reject) => {
        self.s3.deleteObject(params, (err, data) => {
          if (!err) {
            resolve({
              status: 200,
              message: `Object "${filename}" was deleted successfully from bucket "${bucketName}"`
            });
          } else {
            reject({
              status: 400,
              message: err.message
            });
          }
        });
      });
    };

    self.readFile = (bucketName, filename) => {
      if (!bucketName || !filename) {
        return new Promise((resolve, reject) => {
          reject({
            status: 400,
            message: "Invalid parameters"
          });
        });
      }

      let params = {
        Bucket: bucketName,
        Key: filename
      };
      return new Promise((resolve, reject) => {
        self.s3.getObject(params, (err, data) => {
          if (!err) {
            resolve({
              status: 200,
              data: JSON.parse(data.Body.toString("utf-8")),
              message: `Object "${filename}" was fetched successfully from bucket "${bucketName}"`
            });
          } else {
            reject({
              status: 400,
              message: err.message
            });
          }
        });
      });
    };
  }
}
module.exports = {
  getAWS,
  AwsWrapper
};
