const mysql = require('mysql2');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'agro5',
  port: process.env.DB_PORT || 3306
});

let connected = false;
const readyResolve = [];
const ready = new Promise(resolve => {
  if (connected) resolve();
  else readyResolve.push(resolve);
});

function connectWithRetry(attempt = 1) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error(`Error connecting to database (attempt ${attempt}): ${err.code}`);
      const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
      setTimeout(() => connectWithRetry(attempt + 1), delay);
      return;
    }
    console.log('Connected to database as id ' + connection.threadId);
    connected = true;
    readyResolve.forEach(r => r());
    connection.release();
  });
}

connectWithRetry();

pool.ready = ready;
module.exports = pool;
