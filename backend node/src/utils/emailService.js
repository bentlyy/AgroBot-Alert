const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const enviarCorreoRecuperacion = async (email, token) => {
    const mailOptions = {
        to: email,
        from: process.env.EMAIL_USER,
        subject: 'Recuperación de Contraseña',
        text: `Recibiste este correo porque tú (o alguien más) solicitó el restablecimiento de la contraseña para tu cuenta.\n\n
        Haz clic en el siguiente enlace, o pégalo en tu navegador para completar el proceso:\n\n
        ${process.env.FRONTEND_URL}/restablecer/${token}\n\n
        Si no solicitaste esto, ignora este correo y tu contraseña permanecerá sin cambios.\n`
    };

    await transporter.sendMail(mailOptions);
};

module.exports = enviarCorreoRecuperacion;
