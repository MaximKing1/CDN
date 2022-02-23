const config = require('./../config.slave.js');
const path = require('path');
const chalk = require('chalk');

module.exports = async (app) => {
  app.register(require('fastify-formbody'));
  app.register(require('fastify-compress'), { global: true });
  app.register(require('fastify-helmet'), {
    contentSecurityPolicy: false,
  });
  app.register(require('fastify-static'), {
    root: path.join(__dirname, '../uploads'),
    prefix: '/uploads/',
  });

  const start = async () => {
    try {
      await app.listen(config.PORT || 3005, '0.0.0.0');
      console.log(
        chalk.green(`[WEB] Website Listening On Port ${config.PORT || 3005}...`)
      );
    } catch (err) {
      console.error(err);
    }
  };
  start();
};
