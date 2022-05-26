'use strict';

const spawn = require('child_process').spawn;

module.exports = {
  restartDevice: async () => {
    console.log('Device Restart Incoming');
    return spawn('shutdown', '-r');
  },
  shutDownDevice: async () => {
    console.log('Device Shutdown Incoming');
    return spawn('shutdown', '-s');
  },
  deviceSleep: async () => {
    console.log('Device Sleep Incoming');
    return spawn('shutdown', '-h');
  },
  logOffDevice: async () => {
    console.log('Device Logoff Incoming');
    return spawn('shutdown', '-l');
  },
};
