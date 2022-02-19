const config = require('../../config');
const bcrypt = require('bcrypt');
const xssFilters = require('xss-filters');
const readFile = require('../Functions/readFile');

module.exports = async function (fastify, opts, done) {
  fastify.get('/public/get/:id', async (request, reply) => {
    const ID = request.params.id;
    const file = readFile(ID)
  }); // Public

  fastify.get('/public/info/:id', async (request, reply) => {
    const ID = request.params.id;
  }); // Public

  fastify.post('/public/upload/:id', async (request, reply) => {
    const ID = request.params.id;
  }); // Public

  fastify.post('/private/delete/:id', async (request, reply) => {
    const ID = request.params.id;
    const email = xssFilters.inHTMLData(request.body.email);
    const password = request.body.password;
    const UserManager = app.UserManager.findOne({
      email: email,
    }).then((user) => {
      if (!user) {
        reply.status(401).send({
          error: true,
          email: 'Incorrect Email Address or Password',
        });
      }
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          // Send Data HEre
        }
      });
    });
  }); // Private (Username & Pass Protected)

  fastify.get('/private/get/:id', async (request, reply) => {
    const ID = request.params.id;
    const email = xssFilters.inHTMLData(request.body.email);
    const password = request.body.password;
    const UserManager = app.UserManager.findOne({
      email: email,
    }).then((user) => {
      if (!user) {
        reply.status(401).send({
          error: true,
          email: 'Incorrect Email Address or Password',
        });
      }
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          // Send Data HEre
        }
      });
    });
  }); // Private (Username & Pass Protected)

  fastify.get('/private/info/:id', async (request, reply) => {
    const ID = request.params.id;
    const email = xssFilters.inHTMLData(request.body.email);
    const password = request.body.password;
    const UserManager = app.UserManager.findOne({
      email: email,
    }).then((user) => {
      if (!user) {
        reply.status(401).send({
          error: true,
          email: 'Incorrect Email Address or Password',
        });
      }
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          // Send Data HEre
        }
      });
    });
  }); // Private (Username & Pass Protected)

  fastify.post('/private/upload/:id', async (request, reply) => {
    const ID = request.params.id;
    const email = xssFilters.inHTMLData(request.body.email);
    const password = request.body.password;
    const UserManager = app.UserManager.findOne({
      email: email,
    }).then((user) => {
      if (!user) {
        reply.status(401).send({
          error: true,
          email: 'Incorrect Email Address or Password',
        });
      }
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          // Send Data HEre
        }
      });
    });
  }); // Private (Username & Pass Protected)

  fastify.post('/private/delete/:id', async (request, reply) => {
    const ID = request.params.id;
    const email = xssFilters.inHTMLData(request.body.email);
    const password = request.body.password;
    const UserManager = app.UserManager.findOne({
      email: email,
    }).then((user) => {
      if (!user) {
        reply.status(401).send({
          error: true,
          email: 'Incorrect Email Address or Password',
        });
      }
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          // Send Data HEre
        }
      });
    });
  }); // Private (Username & Pass Protected)
};
