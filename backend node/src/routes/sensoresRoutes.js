const express = require('express');
const router = express.Router();
const SensoresController = require('../controllers/sensoresController');
const sensoresController = new SensoresController();

router.get('/', async (req, res) => {
    try {
        const sensores = await sensoresController.obtenerTodosLosSensores();
        res.json(sensores);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los sensores' });
    }
});

router.post('/guardar', async (req, res) => {
    try {
        const sensores = req.body;
        await sensoresController.guardarSensoresDeApi(sensores);
        res.status(201).json({ message: 'Sensores guardados correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar los sensores' });
    }
});

module.exports = router;
