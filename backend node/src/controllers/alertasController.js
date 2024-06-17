/*const alertasController = require('../controllers/alertasController'); // Suponiendo la ruta de tu controlador

module.exports = function (alertasController) {
  const router = express.Router();

  // Ejemplo de ruta GET con funcionalidad
  router.get('/alertas', async (req, res) => {
    try {
      const alertas = await alertasController.obtenerAlertas(); // Ejemplo de función del controlador
      res.json(alertas); // Envía la respuesta como JSON
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener alertas'); // Maneja errores
    }
  });

  return router;
};*/