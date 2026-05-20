const express = require('express');
const router = express.Router();
const criteriosController = require('../controllers/criteriosController');

router.get('/', criteriosController.getAll);

module.exports = router;
