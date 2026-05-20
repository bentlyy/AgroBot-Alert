const Usuario = require('../models/recuperacionModel');
const enviarCorreoRecuperacion = require('../utils/emailService');
const crypto = require('crypto');

exports.solicitarRecuperacionContraseña = async (req, res) => {
    const { email } = req.body;

    try {
        const usuario = await Usuario.findByEmail(email);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        usuario.resetPasswordToken = token;
        usuario.resetPasswordExpires = Date.now() + 3600000; // 1 hora

        await usuario.save();

        await enviarCorreoRecuperacion(usuario.email, token);

        res.status(200).json({ mensaje: 'Correo de recuperación de contraseña enviado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error del servidor', error });
    }
};

exports.restablecerContraseña = async (req, res) => {
    const { token, nuevaContraseña } = req.body;

    try {
        const usuario = await Usuario.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!usuario) {
            return res.status(400).json({ mensaje: 'El token de recuperación de contraseña es inválido o ha expirado' });
        }

        usuario.password = await usuario.hashPassword(nuevaContraseña);
        usuario.resetPasswordToken = undefined;
        usuario.resetPasswordExpires = undefined;

        await usuario.save();

        res.status(200).json({ mensaje: 'La contraseña ha sido restablecida' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error del servidor', error });
    }
};
