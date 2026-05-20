const pool = require('./dbConnection');
const wialon = require('./wialonService');
const { enviarNotificacion } = require('./notificacionService');

const CRITERION_FIELD_MAP = [
  { keywords: ['temperatura'], fields: ['temperatura_s1', 'temperatura_s2'] },
  { keywords: ['humedad'], fields: ['humedad_s1', 'humedad_s2'] },
  { keywords: ['bateria'], fields: ['gps_energia', 'energia_externa'] },
];

function getFieldsForCriterion(nombre) {
  const lower = nombre.toLowerCase();
  for (const entry of CRITERION_FIELD_MAP) {
    if (entry.keywords.some(k => lower.includes(k))) {
      return entry.fields;
    }
  }
  return [];
}

const INTERVALO_MS = 60 * 1000;
const VENTANA_DUPLICADO_MINUTOS = 15;
let intervaloId = null;

function query(sql, params) {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

async function refrescarDatosSensores() {
  try {
    const unidades = await query('SELECT id_unidad FROM unidades');
    for (const unidad of unidades) {
      const response = await wialon.loadMessages(unidad.id_unidad);
      const messages = response.messages || response;
      if (!messages.length) continue;
      const latest = messages[0];
      const raw = latest.Parameters || latest.p || latest;
      await query(
        `INSERT INTO sensores (id_unidad, temperatura_s1, temperatura_s2, humedad_s1, humedad_s2,
          electroconductividad_s1, electroconductividad_s2, gps_energia, energia_externa)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [unidad.id_unidad,
         raw.Temperature_S1 ?? raw.user_2u_1 ?? null,
         raw.Temperature_S2 ?? raw.user_2u_2 ?? null,
         raw.Humidity_S1 ?? raw.user_2u_3 ?? null,
         raw.Humidity_S2 ?? raw.user_2u_4 ?? null,
         raw.Electroconductivity_S1 ?? raw.user_2u_5 ?? null,
         raw.Electroconductivity_S2 ?? raw.user_2u_6 ?? null,
         raw.GPS_Energy ?? raw.pwr_int ?? null,
         raw.External_Energy ?? raw.pwr_ext ?? null]
      );
    }
  } catch (err) {
    console.error('[AlertEngine] Error refrescando sensores:', err.message);
  }
}

async function existeAlertaReciente(idUnidad, idCriterio) {
  const sql = `SELECT id FROM alertas
    WHERE id_unidad = ? AND id_criterio = ?
      AND fecha_creacion >= NOW() - INTERVAL ? MINUTE
    LIMIT 1`;
  const rows = await query(sql, [idUnidad, idCriterio, VENTANA_DUPLICADO_MINUTOS]);
  return rows.length > 0;
}

async function evaluarAlertas() {
  try {
    const [sensores, criterios] = await Promise.all([
      query(`SELECT s1.*, u.nombre AS unidad_nombre, u.id_usuario
        FROM sensores s1
        JOIN unidades u ON s1.id_unidad = u.id_unidad
        WHERE s1.id_sensor = (
          SELECT MAX(s2.id_sensor) FROM sensores s2 WHERE s2.id_unidad = s1.id_unidad
        )`),
      query('SELECT * FROM criterios'),
    ]);

    if (!criterios.length || !sensores.length) return;

    for (const sensor of sensores) {
      for (const criterio of criterios) {
        const fields = getFieldsForCriterion(criterio.nombre);
        if (!fields.length) continue;

        for (const field of fields) {
          const valor = parseFloat(sensor[field]);
          if (isNaN(valor)) continue;

          let disparado = false;
          if (criterio.valor_referencia_max !== null && valor > criterio.valor_referencia_max) {
            disparado = true;
          }
          if (criterio.valor_referencia_min !== null && valor < criterio.valor_referencia_min) {
            disparado = true;
          }

          if (!disparado) continue;

          if (await existeAlertaReciente(sensor.id_unidad, criterio.id)) {
            continue;
          }

          const tipo = criterio.valor_referencia_max !== null && valor > criterio.valor_referencia_max
            ? 'critico' : 'advertencia';
          const mensaje = `${criterio.nombre} en ${sensor.unidad_nombre}: ${valor} (${field})`;

          const result = await query(
            'INSERT INTO alertas (mensaje, tipo, id_unidad, id_criterio) VALUES (?, ?, ?, ?)',
            [mensaje, tipo, sensor.id_unidad, criterio.id]
          );

          console.log(`[AlertEngine] ${tipo}: ${mensaje}`);

          const usuarioRows = await query(
            'SELECT email, telefono FROM usuarios WHERE id = ?',
            [sensor.id_usuario]
          );

          const alerta = {
            id: result.insertId,
            mensaje,
            tipo,
            id_unidad: sensor.id_unidad,
            id_criterio: criterio.id,
            id_usuario: sensor.id_usuario,
            usuario_email: usuarioRows.length ? usuarioRows[0].email : null,
            usuario_telefono: usuarioRows.length ? usuarioRows[0].telefono : null,
          };
          enviarNotificacion(alerta, criterio).catch(err =>
            console.error('[AlertEngine] Error enviando notificacion:', err.message)
          );
        }
      }
    }
  } catch (err) {
    console.error('[AlertEngine] Error evaluando alertas:', err.message);
  }
}

async function cicloCompleto() {
  await refrescarDatosSensores();
  await evaluarAlertas();
}

function startAlertEngine() {
  if (intervaloId) return;
  console.log(`[AlertEngine] Iniciando ciclo cada ${INTERVALO_MS / 1000}s`);
  cicloCompleto();
  intervaloId = setInterval(cicloCompleto, INTERVALO_MS);
}

function stopAlertEngine() {
  if (intervaloId) {
    clearInterval(intervaloId);
    intervaloId = null;
    console.log('[AlertEngine] Detenido');
  }
}

module.exports = { startAlertEngine, stopAlertEngine };
