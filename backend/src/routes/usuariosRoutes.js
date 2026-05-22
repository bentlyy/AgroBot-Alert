const express = require('express');
const router = express.Router();
const UsuariosModel = require('../models/usuariosModel');
const { authMiddleware, adminOnly } = require('../utils/authMiddleware');

router.get('/', authMiddleware, adminOnly, async (req, res, next) => {
  try {
    const usuarios = await UsuariosModel.findAll();
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
