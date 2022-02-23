const app = require('fastify')(),
  returnServerIP = require('./Functions/returnServerIP'),
  checkServer = require('./Functions/checkServer'),
  io = require('socket.io')();

io.on('connection', (client) => {
  console.log('New Slave Connected', client.id);
});

app.ready((err) => {
  if (err) throw err;

  app.io.on('connect', (socket) =>
    console.info('New Slave Connected!', socket.id)
  );
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
io.listen(process.env.adminPort);
