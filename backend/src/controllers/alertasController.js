const AlertasModel = require('../models/alertasModel');

const alertasController = {};

alertasController.getAll = (req, res) => {
  const idUsuario = req.query.id_usuario || null;
  AlertasModel.getAll((err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'Error al obtener las alertas' });
      return;
    }
    res.json(results);
  }, idUsuario);
};

alertasController.create = (req, res) => {
  const { mensaje, tipo, id_unidad, id_criterio } = req.body;
  AlertasModel.create(mensaje, tipo, id_unidad, id_criterio, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'Error al crear la alerta' });
      return;
    }
    res.json({ message: 'Alerta creada exitosamente', id: results.insertId });
  });
};

module.exports = alertasController;
