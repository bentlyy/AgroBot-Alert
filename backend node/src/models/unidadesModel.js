// unidadesModel.js
const pool = require('../utils/dbConnection');

class UnidadesModel {
  constructor(pool) {
    this.pool = pool;
  }

  async obtenerUnidades() {
    const query = 'SELECT * FROM unidades';
    return new Promise((resolve, reject) => {
      this.pool.query(query, (error, results) => {
        if (error) {
          console.error('Error obteniendo unidades:', error);
          return reject(new Error('Error obteniendo unidades'));
        }
        resolve(results);
      });
    });
  }

  async guardarUnidad(unidad) {
    const { id_unidad, nombre, id_usuario } = unidad;
    if (!id_unidad || !nombre) {
      console.error('Datos de la unidad incompletos:', unidad);
      return Promise.reject(new Error('Datos de la unidad incompletos'));
    }

    try {
      // Verificar si la unidad ya existe en la base de datos
      const unidadExistente = await this.obtenerUnidadPorId(id_unidad);
      if (unidadExistente) {
        console.log(`La unidad con ID ${id_unidad} ya existe en la base de datos.`);
        return;
      }

      // Si la unidad no existe, guardarla en la base de datos
      const query = 'INSERT INTO unidades (id_unidad, nombre, id_usuario) VALUES (?, ?, ?)';
      await new Promise((resolve, reject) => {
        this.pool.query(query, [id_unidad, nombre, id_usuario], (error, results, fields) => {
          if (error) {
            console.error('Error al guardar la unidad:', error);
            return reject(new Error('Error al guardar la unidad'));
          }
          resolve(results);
        });
      });
    } catch (error) {
      throw error;
    }
  }

  async obtenerUnidadPorId(id_unidad) {
    const query = 'SELECT * FROM unidades WHERE id_unidad = ?';
    return new Promise((resolve, reject) => {
      this.pool.query(query, [id_unidad], (error, results) => {
        if (error) {
          console.error('Error obteniendo unidad por ID:', error);
          return reject(new Error('Error obteniendo unidad por ID'));
        }
        if (results.length > 0) {
          resolve(results[0]);
        } else {
          resolve(null);
        }
      });
    });
  }
}

module.exports = UnidadesModel;
