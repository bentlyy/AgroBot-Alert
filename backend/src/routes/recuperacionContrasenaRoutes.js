const express = require('express');
const router = express.Router();

router.post('/solicitar-recuperacion', (req, res) => {
  res.status(410).json({ message: 'La recuperacion local fue deshabilitada. Recupera tu acceso desde AMG.' });
});

module.exports = router;
