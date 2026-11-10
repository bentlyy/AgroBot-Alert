const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
  res.status(410).json({ message: 'El registro local fue deshabilitado. Usa el acceso AMG.' });
});

router.post('/login', (req, res) => {
  res.status(410).json({ message: 'El login local fue deshabilitado. Usa /api/auth/login con AMG SSO.' });
});

module.exports = router;
