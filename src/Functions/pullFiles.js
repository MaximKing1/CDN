const config = require('../../config.slave.js');

module.exports = () => {
   if(config.files == "local") {
      // Run Local Script
   } else if(config.files == "s3") {
      // Run Pull S3 Files
   }
}
