module.exports = async (app) => {
  app.register(require('fastify-formbody'));
  app.register(require('fastify-compress'), { global: true });
  app.register(require('fastify-helmet'), {
    contentSecurityPolicy: false,
  });

  const start = async () => {
    try {
      await app.listen(3005, '0.0.0.0');
      console.log(chalk.green('[WEB] Website Listening On Port 3005...'));
    } catch (err) {
      app.log.error(err);
    }
  };
  start();
};
