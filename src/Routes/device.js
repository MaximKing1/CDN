const {
  restartDevice,
  shutdownDevice,
  logOffDevice,
  sleepDevice,
} = require('../deviceFuncs/deviceFuncs');
const { compare } = require('bcrypt');
const { inHTMLData } = require('xss-filters');

module.exports = async function (fastify, opts, done) {
  fastify.addHook('preHandler', async (request, reply, done) => {
    const email = inHTMLData(request.body.email);
    const password = request.body.password;

    const user = await app.UserManager.findOne({ email });
    if (!user) {
      return reply
        .status(401)
        .send({ error: true, message: 'Incorrect Email Address or Password' });
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return reply
        .status(401)
        .send({ error: true, message: 'Incorrect Email Address or Password' });
    }

    done();
  });

  // Restart Device
  fastify.get('/device/restart', async (request, reply) => {
    try {
      await restartDevice();
      reply.send({ success: true, message: 'Device restarted successfully' });
    } catch (error) {
      reply.status(500).send({
        success: false,
        message: 'Failed to restart device',
        error: error.message,
      });
    }
  });

  // Shutdown Device
  fastify.get('/device/shutdown', async (request, reply) => {
    try {
      await shutdownDevice();
      reply.send({ success: true, message: 'Device shutdown successfully' });
    } catch (error) {
      reply.status(500).send({
        success: false,
        message: 'Failed to shutdown device',
        error: error.message,
      });
    }
  });

  // Log Off Device
  fastify.get('/device/logoff', async (request, reply) => {
    try {
      await logOffDevice();
      reply.send({ success: true, message: 'Device logged off successfully' });
    } catch (error) {
      reply.status(500).send({
        success: false,
        message: 'Failed to log off device',
        error: error.message,
      });
    }
  });

  // Sleep Device
  fastify.get('/device/sleep', async (request, reply) => {
    try {
      await sleepDevice();
      reply.send({
        success: true,
        message: 'Device put to sleep successfully',
      });
    } catch (error) {
      reply.status(500).send({
        success: false,
        message: 'Failed to put device to sleep',
        error: error.message,
      });
    }
  });

  done();
};
