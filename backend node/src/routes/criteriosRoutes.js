const express = require('express');
const router = express.Router();
const criteriosController = require('../controllers/criteriosController');

// Obtener todos los criterios
router.get('/', criteriosController.getAll);

module.exports = router;
