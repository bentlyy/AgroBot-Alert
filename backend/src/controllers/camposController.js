const CamposModel = require('../models/camposModel');

const camposController = {};

camposController.getAll = (req, res) => {
  CamposModel.getAll((err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'Error al obtener los campos' });
      return;
    }
    res.json(results);
  });
};

camposController.create = (req, res) => {
  const { nombre, ubicacion, hectareas } = req.body;
  CamposModel.create(nombre, ubicacion, hectareas, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'Error al crear el campo' });
      return;
    }
    res.json({ message: 'Campo creado exitosamente', id: results.insertId });
  });
};

module.exports = camposController;
