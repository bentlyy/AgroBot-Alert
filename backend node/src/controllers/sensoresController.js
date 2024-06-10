const SensorModel = require('../models/sensorModel');
const pool = require('../utils/dbConnection');
const { makeHttpRequest, loadMessages, getEidFromResponse, logToFile } = require('../utils/wialonApiUtils');

class SensoresController {
  constructor() {
    this.sensorModel = new SensorModel(pool);
  }

  async obtenerEid() {
    const url = 'https://hst-api.wialon.us/wialon/ajax.html';
    const params = { svc: 'token/login', params: JSON.stringify({ token: process.env.API_TOKEN }) };
    const response = await makeHttpRequest(url, params);
    return getEidFromResponse(response);
  }

  async obtenerUnidades(eid) {
    const params = {
      svc: 'core/search_items',
      params: JSON.stringify({
        spec: {
          itemsType: 'avl_unit',
          propName: 'sys_name',
          propValueMask: '*',
          sortType: 'sys_name'
        },
        force: 1,
        flags: 1,
        from: 0,
        to: 0
      }),
      sid: eid
    };

    try {
      const response = await makeHttpRequest('https://hst-api.wialon.us/wialon/ajax.html', params);
      console.log('Respuesta de búsqueda de unidades:', response);
      if (response.error) {
        logToFile(`Error al buscar unidades: código de error ${response.error}`);
        throw new Error(`Error al buscar unidades: código de error ${response.error}`);
      }
      return response.items;
    } catch (error) {
      logToFile('Error al buscar unidades:' + error.message);
      throw new Error('Error al buscar unidades');
    }
  }

  async obtenerTodosLosSensores() {
    try {
      const eid = await this.obtenerEid();
      const unidades = await this.obtenerUnidades(eid);
      logToFile(`Unidades obtenidas: ${JSON.stringify(unidades, null, 2)}`);

      const sensores = [];
      for (const unidad of unidades) {
        const mensajes = await loadMessages(eid, unidad.id);
        mensajes.forEach(mensaje => {
          sensores.push({
            id_sensor: mensaje.Timestamp, // Usar Timestamp como id_sensor
            nombre: `Sensor de unidad ${unidad.params}`, // Nombre del sensor basado en la unidad
            id_unidad: unidad.id
          });
        });
      }
      return sensores;
    } catch (error) {
      logToFile('Error al obtener los sensores:' + error);
      throw error;
    }
  }

  async guardarSensoresDeApi(sensores) {
    try {
      for (const sensor of sensores) {
        await this.sensorModel.guardarSensor(sensor);
      }
      logToFile('Sensores guardados correctamente.');
    } catch (error) {
      logToFile('Error al guardar los sensores:' + error);
      throw error;
    }
  }
}

module.exports = SensoresController;
