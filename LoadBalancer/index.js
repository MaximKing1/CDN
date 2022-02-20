const app = require('fastify')(),
  returnServerIP = require('./Functions/returnServerIP'),
  { yellow } = require('chalk');

console.log(
  ' _                           _     ____            _                                     '
);
console.log(
  '| |       ___     __ _    __| |   | __ )    __ _  | |   ___   _ __     ___    ___   _ __ '
);
console.log(
  "| |      / _    / _` |  / _` |   |  _    / _` | | |  / _  | '_    / __|  / _  | '__|"
);
console.log(
  '| |___  | (_) | | (_| | | (_| |   | |_) | | (_| | | | |  __/ | | | | | (__  |  __/ | |   '
);
console.log(
  '|_____|  ___/   __,_|  __,_|   |____/   __,_| |_|  ___| |_| |_|  ___|  ___| |_|   '
);

app.get('*', async function (req, res) {
  returnServerIP(req).then((data) => {
    const PATH = req.url;

    console.log(
      yellow('[ FORWARDING ]'),
      `${req.ip} Redirecting Request to Local Server --> ${data.server.DOMAIN}${PATH} (${data.server.COUNTRY})`
    );
    res.redirect(`${data.server.DOMAIN}${PATH}`);
  });
});

app.listen(3001);
