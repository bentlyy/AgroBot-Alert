const { enviarAlertaCorreo } = require('./emailService');

let twilioClient = null;
try {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    const twilio = require('twilio');
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
} catch (e) {
  console.log('[Notificaciones] Twilio no disponible. Las alertas solo se enviaran por email.');
}

async function enviarWhatsApp(mensaje, telefono) {
  if (!twilioClient) {
    console.log('[WhatsApp] Twilio no configurado. SKIP.');
    return;
  }

  const from = process.env.TWILIO_WHATSAPP_FROM;
  const to = telefono || process.env.TWILIO_WHATSAPP_TO;

  if (!from || !to) {
    console.log('[WhatsApp] Sin destino. SKIP.');
    return;
  }

  try {
    await twilioClient.messages.create({
      body: mensaje,
      from: `whatsapp:${from}`,
      to: `whatsapp:${to}`,
    });
    console.log(`[WhatsApp] Alerta enviada a ${to}`);
  } catch (err) {
    console.error('[WhatsApp] Error al enviar:', err.message);
  }
}

async function enviarNotificacion(alerta, criterio) {
  const mensaje = alerta.mensaje;
  const tipo = alerta.tipo;

  console.log(`[Notificaciones] Procesando alerta para usuario #${alerta.id_usuario}: ${mensaje}`);

  const promises = [];

  if (criterio.accion && criterio.accion.includes('email')) {
    promises.push(
      enviarAlertaCorreo(mensaje, tipo, 'Unidad', alerta.usuario_email).catch(err =>
        console.error('[Notificaciones] Error email:', err.message)
      )
    );
  }

  if (criterio.accion && criterio.accion.includes('whatsapp')) {
    promises.push(
      enviarWhatsApp(mensaje, alerta.usuario_telefono).catch(err =>
        console.error('[Notificaciones] Error WhatsApp:', err.message)
      )
    );
  }

  if (promises.length === 0) {
    console.log(`[Notificaciones] Sin acciones configuradas para "${criterio.accion}". SKIP.`);
  }

  await Promise.allSettled(promises);
}

module.exports = { enviarNotificacion };
