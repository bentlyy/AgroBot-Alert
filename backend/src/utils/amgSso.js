const { loadConfig, mountAmgAuth, identity, buildLoginUrl, isSafeReturnTo } = require('@amg/auth-client');

const ssoConfig = loadConfig(process.env, 'agrobot');

const DEFAULT_NEXT = '/dashboard';

function nextPath(value) {
  return typeof value === 'string' && isSafeReturnTo(value) ? value : DEFAULT_NEXT;
}

function mountAgroBotSso(app) {
  app.use(
    mountAmgAuth(ssoConfig, {
      productName: 'AgroBot',
      publicPaths: ['/health', '/auth', '/api/auth', '/api/health'],
    }),
  );

  app.get('/api/auth/login', (req, res) => {
    // El Core devuelve `state` al callback; usarlo para volver al dashboard y no
    // a "/" (que es la pantalla de login y dejaba al usuario en un bucle visual).
    res.redirect(302, buildLoginUrl(ssoConfig, undefined, nextPath(req.query.next)));
  });

  app.get('/api/auth/me', (req, res) => {
    if (!req.amg) {
      return res.status(401).json({
        error: 'sin-sesion',
        loginUrl: buildLoginUrl(ssoConfig, undefined, DEFAULT_NEXT),
      });
    }
    const amg = identity(req);
    res.json({
      authenticated: true,
      usuario: {
        id: amg.userId,
        nombre: amg.name || amg.email || 'Usuario AMG',
        email: amg.email || '',
        rol: amg.role === 'owner' || amg.role === 'admin' ? 'admin' : 'usuario',
      },
      org: {
        id: amg.organizationId,
        slug: amg.organizationSlug || '',
        name: amg.organizationName || '',
      },
      amg: {
        role: amg.role,
        product: amg.product,
        sessionId: amg.sessionId,
      },
    });
  });
}

module.exports = { ssoConfig, mountAgroBotSso, buildLoginUrl };
