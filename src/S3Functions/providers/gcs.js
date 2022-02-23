const Storage = require("@google-cloud/storage");
const crc32 = require("fast-crc32c");

function getGCS(options) {
  let storage = new Storage({
    keyFilename: options.keyFilename
  });
  return new GcsWrapper(storage);
}

class GcsWrapper {
  constructor(storage) {
    this.storage = storage;
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
        self.storage.createBucket(name, (err, data) => {
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

      let bucket = self.storage.bucket(name);

      return new Promise((resolve, reject) => {
        bucket.delete((err, data) => {
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

      let bucket = self.storage.bucket(bucketName);

      return new Promise((resolve, reject) => {
        bucket.upload(filePath, function(err, file, apiResponse) {
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

    self.downloadFile = (bucketName, filename, saveToPath) => {
      if (!bucketName || !filename || !saveToPath) {
        return new Promise((resolve, reject) => {
          reject({
            status: 400,
            message: "Invalid parameters"
          });
        });
      }

      let bucket = self.storage.bucket(bucketName);
      let file = bucket.file(filename);

      return new Promise((resolve, reject) => {
        file.download({ destination: saveToPath }, function(
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

      let bucket = self.storage.bucket(bucketName);
      let file = bucket.file(filename);

      return new Promise((resolve, reject) => {
        let stringifiedObject = JSON.stringify(object);
        file.save(stringifiedObject, (err, data) => {
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

      return new Promise((resolve, reject) => {
        let bucket = self.storage.bucket(bucketName, err => {
          if (err) {
            reject({
              status: 400,
              message: err.message
            });
          }
        });

        bucket.getFiles((err, data) => {
          if (!err) {
            let objects = [];
            data.forEach(element => {
              objects.push({
                filename: element.id
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
        let bucket = self.storage.bucket(bucketName, err => {
          if (err) {
            reject({
              status: 400,
              message: err.message
            });
          }
        });

        let file = bucket.file(filename, err => {
          if (err) {
            reject({
              status: 400,
              message: err.message
            });
          }
        });

        file.delete((err, data) => {
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

      let objectData;
      return new Promise((resolve, reject) => {
        let bucket = self.storage.bucket(bucketName, err => {
          if (err) {
            reject({
              status: 400,
              message: err.message
            });
          }
        });
        let file = bucket.file(filename, err => {
          if (err) {
            reject({
              status: 400,
              message: err.message
            });
          }
        });

        file
          .createReadStream()
          .on("error", err => {
            reject({
              status: 400,
              message: err.message
            });
          })
          .on("response", response => {
            // Server connected and responded with the specified status and headers.
          })
          .on("data", data => {
            objectData = data;
          })
          .on("end", () => {
            resolve({
              status: 200,
              data: JSON.parse(objectData.toString("utf8")),
              message: `Object "${filename}" was fetched successfully from bucket "${bucketName}"`
            });
          });
      });
    };
  }
}

module.exports = {
  getGCS
};
