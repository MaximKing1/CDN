const app = require('fastify')({ logger: false });

require('./Modules/fastify')(app);
require('./Modules/collections')(app);
require('./Modules/routers')(app);

if (process.env.files == 's3') {
  setInterval(async function () {
    await require('./Functions/Downloads/pullFiles')(app);
  }, 300000);
} else if (process.env.files == 'local') {
  setInterval(async function () {
    await require('./Functions/Downloads/pullFilesFromCore')(app);
  }, 300000);
}
