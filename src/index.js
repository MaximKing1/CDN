const app = require('fastify')({ logger: false });

require('./Modules/fastify')(app);
require('./Modules/collections')(app);
require('./Modules/routers')(app);

setInterval(async function() {
   await require('./Modules/pullFiles')(app)
}, 300000);
