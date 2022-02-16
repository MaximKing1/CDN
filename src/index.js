const app = require('fastify')({ logger: false });

require('./Modules/fastify')(app);
require('./Modules/collections')(app);
require('./Modules/routers')(app);

console.log(app.UserManager);
