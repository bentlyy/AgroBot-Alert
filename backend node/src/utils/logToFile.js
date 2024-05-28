const fs = require('fs');
const path = require('path');

module.exports = function logToFile(message) {
  const logDir = './logs';
  const logFile = path.join(logDir, 'app.log');
  const currentDate = new Date().toISOString();
  const logEntry = `[${currentDate}] ${message}\n`;

  try {
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    fs.appendFileSync(logFile, logEntry);
    console.log(message); // Opcionalmente imprime en consola también
  } catch (error) {
    console.error('Error writing to log file:', error);
  }
};
