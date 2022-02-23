const app = require('fastify')(),
  returnServerIP = require('./Functions/returnServerIP'),
  checkServer = require('./Functions/checkServer'),
  { yellow } = require('chalk');

app.get('*', async function (req, res) {
  returnServerIP(req).then((data) => {
    checkServer(data.server.DOMAIN).then((status) => {
      const PATH = req.url;

      console.log(
        yellow('[ FORWARDING ]'),
        `${req.ip} Redirecting Request to Local Server --> ${data.server.DOMAIN}${PATH} (${data.server.COUNTRY}) -- Server: ${status}`
      );
      res.redirect(`${data.server.DOMAIN}${PATH}`);
    });
  });
});

app.listen(3001);
