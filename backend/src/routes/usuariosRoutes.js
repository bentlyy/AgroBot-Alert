const express = require('express');
const router = express.Router();
const UsuariosModel = require('../models/usuariosModel');

router.get('/', async (req, res, next) => {
  try {
    const usuarios = await UsuariosModel.findAll();
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
