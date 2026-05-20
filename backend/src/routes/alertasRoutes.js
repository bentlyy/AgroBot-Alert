const express = require('express');
const router = express.Router();
const alertasController = require('../controllers/alertasController');

router.get('/', alertasController.getAll);
router.post('/', alertasController.create);

module.exports = router;
