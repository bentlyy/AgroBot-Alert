const express = require('express');
const router = express.Router();
const camposController = require('../controllers/camposController');
const { authMiddleware } = require('../utils/authMiddleware');

router.get('/', authMiddleware, camposController.getAll);
router.post('/', authMiddleware, camposController.create);

module.exports = router;
