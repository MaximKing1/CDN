const bcrypt = require('bcrypt');
const xssFilters = require('xss-filters');
const readFile = require('../Functions/readFile');

async function authenticate(email, password) {
  const user = await app.UserManager.findOne({
    email: xssFilters.inHTMLData(email),
  });

  if (!user) {
    return { error: true, message: 'Incorrect Email Address or Password' };
  }

  const isAMatch = await bcrypt.compare(password, user.password);

  if (!isAMatch) {
    return { error: true, message: 'Incorrect Email Address or Password' };
  }

  return { user: user, auth: true, message: 'Correct User Details' };
}

module.exports = async function (fastify, opts, done) {
  fastify.get('/public/get/:id', async (request, reply) => {
    const ID = request.params.id;
    const file = readFile(ID);
    // Handle the file data, possibly sending it in the response.
    reply.send({ file });
  });

  fastify.get('/public/info/:id', async (request, reply) => {
    const ID = request.params.id;
    const file = readFile(ID);
  
    reply.send({ info: file });
  });

  fastify.post('/public/upload/:id', async (request, reply) => {
    const ID = request.params.id;
    const file = request.body.file;
    // Handle the file upload logic here.
    reply.send({ success: true });
  });

  fastify.post('/private/delete/:id', async (request, reply) => {
    const { email, password } = request.body;
    const auth = await authenticate(email, password);
    if (auth.error) {
      return reply.status(401).send(auth);
    }
    const ID = request.params.id;
    // Handle the delete logic here.
    reply.send({ success: true });
  });

  ['/private/get/:id', '/private/info/:id', '/private/upload/:id'].forEach(
    (endpoint) => {
      fastify.route({
        method: ['GET', 'POST'],
        url: endpoint,
        handler: async (request, reply) => {
          const { email, password } = request.body;
          const auth = await authenticate(email, password);
          if (auth.error) {
            return reply.status(401).send(auth);
          }
          const ID = request.params.id;
          
          // TODO: Handle the logic here.

          reply.send({ success: true });
        },
      });
    }
  );

  done();
};
