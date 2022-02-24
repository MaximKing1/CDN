const app = require('fastify')(),
  returnServerIP = require('./Functions/returnServerIP'),
  checkServer = require('./Functions/checkServer'),
  io = require('socket.io')();

io.on('connection', (client) => {
  console.log('New Slave Connected', client.id);
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

const start = async () => {
  try {
    await app.listen(process.env.PORT, '0.0.0.0');
    await io.listen(process.env.adminPort, '0.0.0.0');
    console.log(
      `[ CDN: ${process.env.name} ] Location & Load Balencer Listening On Port ${process.env.PORT}...`
    );
    console.log(
      `[ SOCKET.IO ] Socket.io Listening On Port ${process.env.adminPort}...`
    );
  } catch (err) {
    console.error(err);
  }
};
start();
