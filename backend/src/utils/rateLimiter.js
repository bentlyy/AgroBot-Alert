const requestCounts = new Map();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 600;

function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();

  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, []);
  }

  const timestamps = requestCounts.get(ip).filter(ts => now - ts < WINDOW_MS);
  timestamps.push(now);
  requestCounts.set(ip, timestamps);

  if (timestamps.length > MAX_REQUESTS) {
    return res.status(429).json({ message: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.' });
  }

  next();
}

function authRateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();

  if (!requestCounts.has(`auth_${ip}`)) {
    requestCounts.set(`auth_${ip}`, []);
  }

  const timestamps = requestCounts.get(`auth_${ip}`).filter(ts => now - ts < 60000);
  timestamps.push(now);
  requestCounts.set(`auth_${ip}`, timestamps);

  if (timestamps.length > 10) {
    return res.status(429).json({ message: 'Demasiados intentos. Intenta de nuevo en 1 minuto.' });
  }

  next();
}

setInterval(() => {
  const cutoff = Date.now() - WINDOW_MS;
  for (const [key, timestamps] of requestCounts.entries()) {
    const filtered = timestamps.filter(ts => ts > cutoff);
    if (filtered.length === 0) {
      requestCounts.delete(key);
    } else {
      requestCounts.set(key, filtered);
    }
  }
}, 60000);

module.exports = { rateLimiter, authRateLimiter };
