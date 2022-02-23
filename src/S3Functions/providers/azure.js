const azure = require("azure-storage");
const crc32 = require("fast-crc32c");
const path = require("path");
const fs = require("fs");

function getAZURE(options) {
  let blobService = azure.createBlobService(
    options.accountName,
    options.accountKey
  );
  return new AzureWrapper(blobService);
}

class AzureWrapper {
  constructor(blobService) {
    this.blobService = blobService;
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
        self.blobService.createContainerIfNotExists(
          name,
          {
            publicAccessLevel: "blob"
          },
          (err, data) => {
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
          }
        );
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
        self.blobService.deleteContainerIfExists(name, (err, data) => {
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

      let remoteFilename = path.basename(filePath);
      return new Promise((resolve, reject) => {
        self.blobService.createBlockBlobFromLocalFile(
          bucketName,
          remoteFilename,
          filePath,
          function(err, result, response) {
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
          }
        );
      });
    };

    self.downloadFile = (bucketName, filename, saveToPath) => {
      if (!bucketName || !filename || !saveToPath) {
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
      let file = fs.createWriteStream(saveToPath);

      return new Promise((resolve, reject) => {
        self.blobService.getBlobToStream(bucketName, filename, file, function(
          err,
          result,
          response
        ) {
          if (!err) {
            resolve({
              status: 200,
              message: `File "${filename}" was downloaded successfully from bucket "${bucketName}"`
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

    self.createFileFromText = (
      bucketName,
      filename,
      object,
      shouldSimulateFileCorruption = false
    ) => {
      if (!bucketName || !filename || !object) {
        return new Promise((resolve, reject) => {
          reject({
            status: 400,
            message: "Invalid parameters"
          });
        });
      }

      return new Promise((resolve, reject) => {
        let stringifiedObject = JSON.stringify(object);
        self.blobService.createBlockBlobFromText(
          bucketName,
          filename,
          stringifiedObject,
          (err, data) => {
            if (!err) {
              // Check whether file was properly uploaded
              let localFileCrc32 = crc32.calculate(stringifiedObject);
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
          }
        );
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

      return new Promise((resolve, reject) => {
        self.blobService.listBlobsSegmented(bucketName, null, (err, data) => {
          if (!err) {
            let objects = [];
            data.entries.forEach(element => {
              objects.push({
                filename: element.name
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

      return new Promise((resolve, reject) => {
        self.blobService.deleteBlob(bucketName, filename, (err, data) => {
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

      return new Promise((resolve, reject) => {
        self.blobService.getBlobToText(bucketName, filename, (err, data) => {
          if (!err) {
            resolve({
              status: 200,
              data: JSON.parse(data),
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
  getAZURE
};
