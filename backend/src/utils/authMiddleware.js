function authMiddleware(req, res, next) {
  if (!req.amg) {
    return res.status(401).json({ message: 'Sesion AMG no disponible' });
  }
  req.user = {
    id: req.amg.userId,
    nombre: req.amg.name || req.amg.email || 'Usuario AMG',
    email: req.amg.email || '',
    rol: req.amg.role === 'owner' || req.amg.role === 'admin' ? 'admin' : 'usuario',
    organizationId: req.amg.organizationId,
  };
  next();
}

function adminOnly(req, res, next) {
  if (req.user && req.user.rol === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Acceso denegado: se requiere rol admin' });
}

module.exports = { authMiddleware, adminOnly };
