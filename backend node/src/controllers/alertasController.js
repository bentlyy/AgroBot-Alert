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

const AlertasModel = require('../models/alertasModel');
const MedicionesModel = require('../models/medicionesModel');
const pool = require('../utils/dbConnection');

class AlertasController {
  constructor() {
    this.alertasModel = new AlertasModel(pool);
    this.medicionesModel = new MedicionesModel(pool);
  }

  async generarAlerta(id_sensor, criterio) {
    try {
      const ultimaMedicion = await this.medicionesModel.obtenerUltimaMedicion(id_sensor);
      if (!ultimaMedicion) {
        throw new Error('No se encontró ninguna medición para el sensor especificado.');
      }

      const { valor, timestamp } = ultimaMedicion;
      if (valor > criterio.umbral) { // Ajusta la lógica del criterio según sea necesario
        const mensaje = `Alerta: El valor de ${valor} excede el umbral de ${criterio.umbral}`;
        const alerta = {
          id_unidad: criterio.id_unidad,
          id_sensor: id_sensor,
          id_criterio: criterio.id_criterio,
          mensaje: mensaje,
          timestamp: timestamp
        };
        await this.alertasModel.guardarAlerta(alerta);
        return alerta;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error generando alerta:', error);
      throw new Error('Error generando alerta');
    }
  }
}

module.exports = AlertasController;



