const express = require('express');
const router = express.Router();
const criteriosController = require('../controllers/criteriosController');
const { authMiddleware } = require('../utils/authMiddleware');

router.get('/', authMiddleware, criteriosController.getAll);

module.exports = router;
