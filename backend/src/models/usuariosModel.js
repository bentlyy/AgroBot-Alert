const pool = require('../utils/dbConnection');

class UsuariosModel {
  static createUser(email, nombre, contrasena, rol) {
    const SQL = 'INSERT INTO usuarios (email, nombre, contrasena, rol) VALUES (?,?,?,?)';
    const values = [email, nombre, contrasena, rol];
    return new Promise((resolve, reject) => {
      pool.query(SQL, values, (err, results) => {
        if (err) {
          console.error('Error al crear usuario:', err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  static findUser(nombre, contrasena) {
    const SQL = 'SELECT * FROM usuarios WHERE nombre = ? AND contrasena = ?';
    const values = [nombre, contrasena];
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

  static findUserByName(nombre) {
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

  static findAll() {
    const SQL = 'SELECT id, email, nombre, rol, created_at FROM usuarios';
    return new Promise((resolve, reject) => {
      pool.query(SQL, (err, results) => {
        if (err) {
          console.error('Error al obtener usuarios:', err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
}

module.exports = UsuariosModel;
