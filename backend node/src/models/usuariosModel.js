//UsuariosModel.js

const pool = require('../utils/dbConnection');

class UsuariosModel {
  static createUser(email, nombre, contraseña, rol) {
    const SQL = 'INSERT INTO usuarios (email, nombre, contraseña, rol) VALUES (?,?,?,?)';
    const values = [email, nombre, contraseña, rol];
    return new Promise((resolve, reject) => {
      pool.query(SQL, values, (err, results) => {
        if (err) {
          console.error('Error al crear usuario:', err);
          reject(err);
        } else {
          console.log('Usuario creado con éxito');
          resolve(results);
        }
      });
    });
  }

  static findUser(nombre, contraseña) {
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
}

module.exports = UsuariosModel;
