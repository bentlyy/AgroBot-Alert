const SensorModel = require('../models/sensorModel');
const { makeHttpRequest, loadMessages, getEidFromResponse, logToFile } = require('../utils/wialonApiUtils');

class SensoresController {
  constructor() {
    this.sensorModel = new SensorModel();
  }

  async obtenerTodosLosSensores() {
    try {
      const eid = await this.obtenerEid();

      // Aquí vamos a obtener todas las unidades y luego obtener los mensajes de cada una
      const unidades = await this.obtenerUnidades(eid);
      logToFile(`Unidades obtenidas: ${JSON.stringify(unidades, null, 2)}`);  // Log unidades

      const sensores = [];
      for (const unidad of unidades) {
        const mensajes = await loadMessages(eid, unidad.id);

        mensajes.forEach(mensaje => {
          sensores.push({
            id_sensor: mensaje.Timestamp, // Asumiendo que el mensaje tiene un campo `Timestamp` como id_sensor
            nombre: `Sensor de unidad ${unidad.name}`, // Puedes ajustar esto según el nombre real del sensor si está disponible
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
      console.log('Respuesta de búsqueda de unidades:', response); // Agregar este registro
      if (response.error) {
        throw new Error(`Error al buscar unidades: código de error ${response.error}`);
      }
      return response.items;
    } catch (error) {
      logToFile('Error al buscar unidades:' + error);
      throw new Error('Error al buscar unidades');
    }
    
  }
}

module.exports = SensoresController;
