const AlertasModel = require('../models/alertasModel');
const { generarAlertasAhora } = require('../utils/alertEngine');

const alertasController = {};

alertasController.getAll = (req, res) => {
  const isAdmin = req.user && req.user.rol === 'admin';
  const idUsuario = isAdmin ? (req.query.id_usuario || null) : req.user.id;
  AlertasModel.getAll((err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'Error al obtener las alertas' });
      return;
    }
    res.json(results);
  }, idUsuario);
};

alertasController.estadoNotificaciones = (req, res) => {
  const twilioSid = !!process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = !!process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_WHATSAPP_FROM || '(no configurado)';
  const twilioTo = process.env.TWILIO_WHATSAPP_TO || '(no configurado)';
  const emailUser = !!process.env.EMAIL_USER;
  const emailPass = !!process.env.EMAIL_PASS;
  const alertEmailTo = process.env.ALERT_EMAIL_TO || '(no configurado)';
  res.json({
    whatsapp: {
      configurado: twilioSid && twilioToken,
      desde: twilioFrom,
      destino_predeterminado: twilioTo,
    },
    email: {
      configurado: emailUser && emailPass,
      usuario: process.env.EMAIL_USER || '(no configurado)',
      destino_predeterminado: alertEmailTo,
    },
  });
};

alertasController.generarAlertas = async (req, res) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ message: 'Solo admin puede generar alertas' });
  }
  try {
    await generarAlertasAhora();
    res.json({ message: 'Alertas generadas exitosamente' });
  } catch (err) {
    console.error('[Alertas] Error generando alertas:', err.message);
    res.status(500).json({ message: 'Error generando alertas' });
  }
};

alertasController.create = (req, res) => {
  const { mensaje, tipo, id_unidad, id_criterio } = req.body;
  AlertasModel.create(mensaje, tipo, id_unidad, id_criterio, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'Error al crear la alerta' });
      return;
    }
    res.json({ message: 'Alerta creada exitosamente', id: results.insertId });
  });
};

module.exports = alertasController;
