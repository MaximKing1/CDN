const { genSalt, compare, hash } = require('bcrypt');
const { inHTMLData } = require('xss-filters');

const random = (length = 8) => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length })
    .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
    .join('');
};

module.exports = async function (fastify, opts, done) {
  fastify.post('/addUser', async (request, reply) => {
    try {
      if (request.headers.auth !== process.env.adminPassword) {
        return reply
          .status(403)
          .send({ error: true, message: 'Incorrect Admin Password' });
      }

      const email = inHTMLData(request.body.email);
      const password = request.body.password; // Assuming you pass the password when adding a user.

      let userID = random(20);
      while (await app.UserManager.findOne({ userID })) {
        userID = random(21); // Increase length if collision.
      }

      const existingUser = await app.UserManager.findOne({ email });
      if (existingUser) {
        return reply
          .status(409)
          .send({ error: true, message: 'Email already exists' });
      }

      genSalt(10, (err, salt) => {
        if (err) throw err;
        hash(password, salt, async (err, hashedPassword) => {
          if (err) throw err;
          const newUser = new app.UserManager({
            userID,
            email,
            password: hashedPassword,
            ip: request.ip,
          });

          await newUser.save();
          reply.send({ success: true, message: 'User added successfully' });
        });
      });
    } catch (error) {
      reply.status(500).send({ error: true, message: error.message });
    }
  });

  fastify.post('/checkAccount', async (request, reply) => {
    try {
      const email = inHTMLData(request.body.email);
      const password = request.body.password;

      const user = await app.UserManager.findOne({ email });

      if (!user) {
        return reply
          .status(401)
          .send({
            error: true,
            message: 'Incorrect Email Address or Password',
          });
      }

      const isMatch = await compare(password, user.password);
      if (isMatch) {
        return reply.send({ success: true, message: 'Correct User Details' });
      } else {
        return reply
          .status(401)
          .send({
            error: true,
            message: 'Incorrect Email Address or Password',
          });
      }
    } catch (error) {
      reply.status(500).send({ error: true, message: error.message });
    }
  });

  done();
};