const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalido o expirado' });
  }
}

function adminOnly(req, res, next) {
  if (req.user && req.user.rol === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Acceso denegado: se requiere rol admin' });
}

module.exports = { authMiddleware, adminOnly };
