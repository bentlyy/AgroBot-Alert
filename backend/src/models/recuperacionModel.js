const bcrypt = require('bcryptjs');
const pool = require('../utils/dbConnection');

class User {
  constructor(username, email, password, resetPasswordToken, resetPasswordExpires) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.resetPasswordToken = resetPasswordToken;
    this.resetPasswordExpires = resetPasswordExpires;
  }

  static async findByEmail(email) {
    const SQL = 'SELECT * FROM users WHERE email = ?';
    return new Promise((resolve, reject) => {
      pool.query(SQL, [email], (err, results) => {
        if (err) {
          console.error('Error al buscar usuario por email:', err);
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  async save() {
    const SQL = 'UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE email = ?';
    return new Promise((resolve, reject) => {
      pool.query(SQL, [this.resetPasswordToken, this.resetPasswordExpires, this.email], (err, results) => {
        if (err) {
          console.error('Error al actualizar usuario:', err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}

module.exports = User;
