const pool = require('../utils/dbConnection');

class CriteriosModel {
  static getAll(callback) {
    const SQL = 'SELECT * FROM criterios';
    pool.query(SQL, callback);
  }

  static create(nombre, accion, valorReferenciaMax, valorReferenciaMin, callback) {
    const SQL = 'INSERT INTO criterios (nombre, accion, valor_referencia_max, valor_referencia_min) VALUES (?,?,?,?)';
    const values = [nombre, accion, valorReferenciaMax, valorReferenciaMin];
    pool.query(SQL, values, callback);
  }
}

module.exports = CriteriosModel;
