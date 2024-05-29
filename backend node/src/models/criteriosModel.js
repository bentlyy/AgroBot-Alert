const pool = require('../utils/dbConnection');

class CriteriosModel {
  static createCriterio(nombre, accion, valorReferenciaMax, valorReferenciaMin) {
    const SQL = 'INSERT INTO usuarios (nombre, accion, valorReferenciaMax, valorReferenciaMin) VALUES (?,?,?,?)';
    const values = [nombre, accion, valorReferenciaMax, valorReferenciaMin];
    return new Promise((resolve, reject) => {
      pool.query(SQL, values, (err, results) => {
        if (err) {
          console.error('Error al crear criterio:', err);
          reject(err);
        } else {
          console.log('Usuario creado con éxito');
          resolve(results);
        }
      });
    });
  }

  static findCriterio(nombre, contraseña) {
    const SQL = 'SELECT * FROM usuarios WHERE nombre = ? AND contraseña = ?';
    const values = [nombre, contraseña];
    return new Promise((resolve, reject) => {
      pool.query(SQL, values, (err, results) => {
        if (err) {
          console.error('Error al buscar usuario:', err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  static findCriterioPorAccion(nombre) {
    const SQL = 'SELECT * FROM usuarios WHERE nombre = ?';
    const values = [nombre];
    return new Promise((resolve, reject) => {
      pool.query(SQL, values, (err, results) => {
        if (err) {
          console.error('Error al buscar usuario por nombre:', err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  static findUserByEmail(email) {
    const SQL = 'SELECT * FROM usuarios WHERE email = ?';
    const values = [email];
    return new Promise((resolve, reject) => {
      pool.query(SQL, values, (err, results) => {
        if (err) {
          console.error('Error al buscar usuario por email:', err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
}

module.exports = UsuariosModel;
