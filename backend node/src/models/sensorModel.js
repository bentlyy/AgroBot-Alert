const pool = require('../utils/dbConnection');

class SensorModel {
  constructor() {
    this.pool = pool;
  }

  async guardarSensores(mensajes) {
    try {
      for (const mensaje of mensajes) {
        const { timestamp, unidadId, parametros } = mensaje;
        // Insertar los datos del sensor en la base de datos
        const query = `
          INSERT INTO sensores (timestamp, unidad_id, temperatura1, temperatura2, humedad1, humedad2, electroconductividad1, electroconductividad2, energia_gps, energia_externa)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await new Promise((resolve, reject) => {
          this.pool.query(query, [timestamp, unidadId, parametros.temperatura1, parametros.temperatura2, parametros.humedad1, parametros.humedad2, parametros.electroconductividad1, parametros.electroconductividad2, parametros.energiaGps, parametros.energiaExterna], (error, results) => {
            if (error) {
              console.error('Error al guardar el sensor:', error);
              return reject(new Error('Error al guardar el sensor'));
            }
            resolve(results);
          });
        });
      }
      console.log('¡Sensores guardados exitosamente!');
    } catch (error) {
      console.error('Error guardando sensores:', error);
      throw new Error('Error guardando sensores');
    }
  }
}

module.exports = SensorModel;
