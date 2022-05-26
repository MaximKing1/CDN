const { genSalt, compare, hash } = require('bcrypt');
const { inHTMLData } = require('xss-filters');

const random = (length = 8) => {
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let str = '';
  for (let i = 0; i < length; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return str;
};

module.exports = async function (fastify, opts, done) {
  fastify.post('/addUser', async (request, reply) => {
    if (request.headers.auth === process.env.adminPassword) {
      return reply.send('Incorrect Admin Password');
    } // Checks Admin Password In Config For Adding Users

    var userID = random(20);
    const email = inHTMLData(request.body.email);

    if (await app.UserManager.findOne({ userID: userID })) {
      userID = random(21);
    }

    const UserManager = await app.UserManager.findOne({ email: email });
    if (!UserManager) {
      new app.UserManager({
        userID: userID,
        email: email,
        password: null,
      }).then(async (newUserManager) => {
        genSalt(10, (err, salt) => {
          hash(newUserManager.password, salt, async (err, hash) => {
            if (err) throw err;
            newUserManager.password = hash;
            newUserManager.ip = request.ip;
            await newUserManager.save();
          });
        });
      });
    }
  });

  fastify.post('/checkAccount', async (request, reply) => {
    const email = inHTMLData(request.body.email);
    const password = request.body.password;
    await app.UserManager.findOne({
      email: email,
    }).then(async (user) => {
      if (!user) {
        return reply
          .status(401)
          .send({ error: true, email: 'Incorrect Email Address or Password' });
      }
    });
    await compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        return reply
          .status(200)
          .send({ error: false, message: 'Correct User Details' });
      }
    });
  });
};
