const bcrypt = require('bcrypt');
const xssFilters = require('xss-filters');

module.exports = async function (fastify, opts, done) {
  fastify.post('/addUser', async (request, reply) => {
    if (request.headers.auth === process.env.adminPassword) {
      return reply.send('Incorrect Admin Password');
    } // Checks Admin Password In Config For Adding Users

    const email = xssFilters.inHTMLData(request.body.email);
    const UserManager = app.UserManager.findOne({ email: email });
    if (!UserManager) {
      const newUserManager = new app.UserManager({
        email: email,
      }).then((newUserManager) => {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUserManager.password, salt, (err, hash) => {
            if (err) throw err;
            newUserManager.password = hash;
            newUserManager.ip = request.ip;
            newUserManager.save();
          });
        });
      });
    }
  });

  fastify.post('/checkAccount', async (request, reply) => {
    const email = xssFilters.inHTMLData(request.body.email);
    const password = request.body.password;
    const UserManager = app.UserManager.findOne({
      email: email,
    }).then((user) => {
      if (!user) {
        return reply
          .status(401)
          .send({ error: true, email: 'Incorrect Email Address or Password' });
      }
    });
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        reply
          .status(200)
          .send({ error: false, message: 'Incorrect Password and Email' });
      }
    });
  });
};
