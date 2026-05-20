const express = require('express');
const router = express.Router();
const camposController = require('../controllers/camposController');

router.get('/', camposController.getAll);
router.post('/', camposController.create);

module.exports = router;
