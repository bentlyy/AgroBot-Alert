const bcrypt = require('bcryptjs');
const crypto = require('crypto');
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
        const values = [email];
        return new Promise((resolve, reject) => {
            pool.query(SQL, values, (err, results) => {
                if (err) {
                    console.error('Error al buscar usuario por email:', err);
                    reject(err);
                } else {
                    resolve(results[0]); // Devuelve solo el primer resultado
                }
            });
        });
    }

    async save() {
        const SQL = 'INSERT INTO users (username, email, password, resetPasswordToken, resetPasswordExpires) VALUES (?, ?, ?, ?, ?)';
        const values = [this.username, this.email, this.password, this.resetPasswordToken, this.resetPasswordExpires];
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

    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    async generateResetToken() {
        // Genera un token único utilizando el módulo 'crypto'
        const token = crypto.randomBytes(20).toString('hex');
        // Establece la fecha de expiración del token (por ejemplo, una hora después de ahora)
        const expires = new Date(Date.now() + 3600000);
        // Actualiza las propiedades del usuario
        this.resetPasswordToken = token;
        this.resetPasswordExpires = expires;
        // Guarda los cambios en la base de datos
        await this.save();
        // Devuelve el token generado
        return token;
    }
}

module.exports = User;
