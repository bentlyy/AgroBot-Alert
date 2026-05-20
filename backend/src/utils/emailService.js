const nodemailer = require('nodemailer');

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const emailHabilitado = !!(emailUser && emailPass);

let transporter = null;

if (emailHabilitado) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: emailUser, pass: emailPass },
  });
  console.log('[Email] Servicio configurado con ' + emailUser);
} else {
  console.log('[Email] EMAIL_USER o EMAIL_PASS no configurados. Modo sin correo.');
}

const enviarCorreoRecuperacion = async (email, token) => {
  if (!emailHabilitado || !transporter) {
    console.log('[Email] Servicio no disponible. Omitiendo recuperacion.');
    return;
  }

  const mailOptions = {
    to: email,
    from: emailUser,
    subject: 'Recuperacion de Contrasena - AgroBot Alert',
    text: `Recibiste este correo porque tu (o alguien mas) solicito el restablecimiento de la contrasena para tu cuenta.\n\nHaz clic en el siguiente enlace, o pegalo en tu navegador para completar el proceso:\n\n${process.env.FRONTEND_URL || 'http://localhost:5173'}/restablecer/${token}\n\nSi no solicitaste esto, ignora este correo y tu contrasena permanecera sin cambios.\n`
  };

  await transporter.sendMail(mailOptions);
};

const enviarAlertaCorreo = async (mensaje, tipo, unidadNombre, destinatarioEmail) => {
  if (!emailHabilitado || !transporter) {
    return;
  }

  const to = destinatarioEmail || process.env.ALERT_EMAIL_TO;
  if (!to) {
    console.log('[Email] Sin destinatario. Omitiendo envio.');
    return;
  }

  const mailOptions = {
    to,
    from: emailUser,
    subject: `[${tipo.toUpperCase()}] Alerta AgroBot - ${unidadNombre}`,
    text: mensaje,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { enviarCorreoRecuperacion, enviarAlertaCorreo };
