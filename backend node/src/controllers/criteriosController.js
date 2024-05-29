const Criterios = require('../models/criteriosModel');

const criteriosController = {};

criteriosController.getAll = (req, res) => {
  Criterios.getAll((err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'Error al obtener los criterios' });
      return;
    }
    res.json(results);
  });
};

module.exports = criteriosController;
