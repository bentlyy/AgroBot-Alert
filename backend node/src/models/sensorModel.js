class SensorModel {
  constructor(pool) {
    this.pool = pool;
  }

  async guardarSensor(sensor) {
    const { id_sensor, nombre, id_unidad } = sensor;
    if (!id_sensor || !nombre || !id_unidad) {
      console.error('Datos del sensor incompletos:', sensor);
      return Promise.reject(new Error('Datos del sensor incompletos'));
    }

    const query = 'INSERT INTO sensores (id_sensor, nombre, id_unidad) VALUES (?, ?, ?)';
    const values = [id_sensor, nombre, id_unidad];

    try {
      await new Promise((resolve, reject) => {
        this.pool.query(query, values, (error, results) => {
          if (error) {
            console.error('Error al guardar el sensor:', error);
            return reject(new Error('Error al guardar el sensor'));
          }
          resolve(results);
        });
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = SensorModel;
