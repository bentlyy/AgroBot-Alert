const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
require('dotenv').config();

const options = {
    auth: {
        api_key: process.env.SENDGRID_API_KEY
    }
};

const transporter = nodemailer.createTransport(sgTransport(options));

const enviarCorreoRecuperacion = async (email, token) => {
    const mailOptions = {
        to: email,
        from: 'agrobotalert@gmail.com',
        subject: 'Recuperación de Contraseña',
        text: `Recibiste este correo porque tú (o alguien más) solicitó el restablecimiento de la contraseña para tu cuenta.\n\n
        Haz clic en el siguiente enlace, o pégalo en tu navegador para completar el proceso:\n\n
        ${process.env.FRONTEND_URL}/restablecer/${token}\n\n
        Si no solicitaste esto, ignora este correo y tu contraseña permanecerá sin cambios.\n`
    };

    await transporter.sendMail(mailOptions);
};

module.exports = enviarCorreoRecuperacion;
