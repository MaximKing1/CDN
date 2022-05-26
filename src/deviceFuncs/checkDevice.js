'use strict';

const os = require('node:os');
const si = require('systeminformation');

module.exports = {
  isDeviceHealthy: async () => {
    var deviceHealth = 0;
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = si.mem().used;
    const Battery = si.battery();

    if (freeMemory === 0) {
      deviceHealth += 0;
    } else if (freeMemory < usedMemory) {
      deviceHealth += 5;
    } else if (freeMemory > usedMemory) {
      deviceHealth += 15;
    } else if (Battery.hasBattery) {
      if (Battery.isCharging) {
        deviceHealth += 10;
      } else {
        deviceHealth += 5;
      }
    }

    return deviceHealth;
  },
  startDeviceMonitoring: async () => {},
  deviceMonitoringStarted: async () => {},
  sendErrorResponse: async () => {},
};
