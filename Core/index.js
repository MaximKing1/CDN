const app = require('fastify')(),
  returnServerIP = require('./Functions/returnServerIP'),
  checkServer = require('./Functions/checkServer');

app.register(require('fastify-socket.io'), {});

app.ready((err) => {
  if (err) throw err;

  app.io.on('connect', (socket) =>
    console.info('New Slave Connected!', socket.id)
  );
});

app.get('/new/server', function (req, res) {
  app.io.emit('connect');
});

app.get('*', async function (req, res) {
  returnServerIP(req).then((data) => {
    checkServer(data.server.DOMAIN).then((status) => {
      const PATH = req.url;

      console.log(
        '[ FORWARDING ]',
        `${req.ip} Redirecting Request to Local Server --> ${data.server.DOMAIN}${PATH} (${data.server.COUNTRY}) -- Server: ${status}`
      );
      res.redirect(`${data.server.DOMAIN}${PATH}`);
    });
  });
});

app.listen(process.env.PORT);
