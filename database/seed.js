/**
 * AgroBot-Alert - Seed Script
 *
 * Puebla la base de datos con datos de ejemplo.
 * Uso: node database/seed.js (desde la raíz del proyecto)
 *
 * Requisitos:
 *   1. Tener MySQL corriendo (o Docker: docker compose up -d)
 *   2. Tener dependencias instaladas: npm run install:all
 *   3. Tener un archivo backend/.env con las credenciales de BD
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', 'backend', '.env') });
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'agro5',
    port: process.env.DB_PORT || 3306,
    multipleStatements: true
  });

  console.log('Conectado a MySQL. Insertando datos de ejemplo...\n');

  const hashedPassword = await bcrypt.hash('admin123', 10);

  // 1. Usuarios
  await connection.query(`DELETE FROM usuarios WHERE email IN ('admin@agrobot.com', 'garayaa0606@gmail.com')`);
  const usuariosRows = [
    ['admin@agrobot.com', 'Administrador', hashedPassword, 'admin', null],
    ['garayaa0606@gmail.com', 'Usuario Demo', hashedPassword, 'usuario', '+56953818617']
  ];
  await connection.query(
    'INSERT INTO usuarios (email, nombre, contrasena, rol, telefono) VALUES ?',
    [usuariosRows]
  );
  console.log('✓ Usuarios creados (admin) y (garayaa0606@gmail.com / admin123)');

  // 2. Password recovery user
  await connection.query(`DELETE FROM users WHERE email IN ('admin@agrobot.com', 'garayaa0606@gmail.com')`);
  await connection.query(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    ['Administrador', 'admin@agrobot.com', hashedPassword]
  );
  await connection.query(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    ['Usuario Demo', 'garayaa0606@gmail.com', hashedPassword]
  );
  console.log('✓ Tabla users poblada');

  // 3. Unidades
  await connection.query('DELETE FROM unidades WHERE id_unidad >= 1000');
  const unidadesRows = [
    [1001, 'Estacion Central',    2, -33.4567890, -70.6500000],
    [1002, 'Tractor 01 - Sur',    2, -33.5000000, -70.6200000],
    [1003, 'Estacion Norte',      2, -33.4000000, -70.7000000],
    [1004, 'Tractor 02 - Este',   2, -33.4800000, -70.5800000],
    [1005, 'Estacion Oeste',      2, -33.5200000, -70.7200000],
  ];
  await connection.query(
    'INSERT INTO unidades (id_unidad, nombre, id_usuario, latitude, longitude) VALUES ?',
    [unidadesRows]
  );
  console.log('✓ 5 unidades de monitoreo creadas');

  // 4. Sensores
  await connection.query('DELETE FROM sensores WHERE id_sensor >= 1');
  const sensoresRows = [
    [1001, 'Sensor T-H Central',    25.3, 24.8, 65.2, 63.1, 1.2, 1.3, 4.8, 5.0],
    [1001, 'Sensor EC Central',     26.1, 25.4, 64.0, 62.5, 1.5, 1.6, 4.7, 5.0],
    [1002, 'Sensor Tractor Sur',    32.7, 31.9, 45.0, 43.2, 0.8, 0.9, 3.2, 4.1],
    [1003, 'Sensor Estación Norte', 18.5, 17.9, 78.3, 76.8, 1.0, 1.1, 4.9, 5.0],
    [1004, 'Sensor Tractor Este',   29.4, 28.7, 52.1, 50.3, 0.7, 0.8, 3.5, 4.3],
    [1005, 'Sensor Estación Oeste', 21.2, 20.6, 71.5, 70.0, 1.1, 1.2, 4.6, 5.0],
  ];
  await connection.query(
    `INSERT INTO sensores (id_unidad, nombre, temperatura_s1, temperatura_s2,
      humedad_s1, humedad_s2, electroconductividad_s1, electroconductividad_s2,
      gps_energia, energia_externa) VALUES ?`,
    [sensoresRows]
  );
  console.log('✓ 6 sensores creados');

  // 5. Mediciones
  await connection.query('DELETE FROM mediciones WHERE id_sensor <= 6');
  const now = new Date();
  const mediciones = [];
  for (let i = 6; i >= 1; i--) {
    const ts = new Date(now.getTime() - i * 3600000);
    mediciones.push([1, '25.3', ts]);
    mediciones.push([2, '65.2', ts]);
  }
  await connection.query(
    'INSERT INTO mediciones (id_sensor, valor, timestamp) VALUES ?',
    [mediciones]
  );
  console.log('✓ Mediciones de ejemplo creadas');

  // 6. Criterios
  await connection.query('DELETE FROM criterios WHERE id >= 1');
  const criteriosRows = [
    ['Temperatura alta',     'enviar_alerta_email_whatsapp', 35.0, null],
    ['Temperatura baja',     'enviar_alerta_email_whatsapp', null, 5.0],
    ['Humedad critica baja', 'enviar_alerta_email_whatsapp', null, 30.0],
    ['Humedad excesiva',     'enviar_alerta_email_whatsapp', 90.0, null],
    ['Bateria baja',         'enviar_alerta_email_whatsapp', null, 20.0],
  ];
  await connection.query(
    'INSERT INTO criterios (nombre, accion, valor_referencia_max, valor_referencia_min) VALUES ?',
    [criteriosRows]
  );
  console.log('✓ 5 criterios de alerta creados');

  // 7. Alertas
  await connection.query('DELETE FROM alertas WHERE id >= 1');
  const alertasRows = [
    ['Temperatura alta detectada en Tractor 01 - Sur: 36.0°C', 'critico', 1002, 1, new Date(now.getTime() - 3600000)],
    ['Batería baja en Estación Norte: 15% restante', 'advertencia', 1003, 5, new Date(now.getTime() - 10800000)],
    ['Humedad crítica baja en Tractor 02 - Este: 28%', 'critico', 1004, 3, new Date(now.getTime() - 18000000)],
  ];
  await connection.query(
    'INSERT INTO alertas (mensaje, tipo, id_unidad, id_criterio, fecha_creacion) VALUES ?',
    [alertasRows]
  );
  console.log('✓ 3 alertas de ejemplo creadas');

  // 8. Campos
  await connection.query('DELETE FROM campos WHERE id >= 1');
  const camposRows = [
    ['Campo Norte', 'Sector Norte - Parcela A', 120.50],
    ['Campo Sur',   'Sector Sur - Parcela B',   85.30],
    ['Campo Este',  'Sector Este - Parcela C',  95.00],
    ['Campo Oeste', 'Sector Oeste - Parcela D', 110.75],
  ];
  await connection.query(
    'INSERT INTO campos (nombre, ubicacion, hectareas) VALUES ?',
    [camposRows]
  );
  console.log('✓ 4 campos agrícolas creados');

  await connection.end();
  console.log('\n✅ Base de datos poblada exitosamente.');
  console.log('\nCredenciales de prueba:');
  console.log('  Admin: admin@agrobot.com           / admin123');
  console.log('  Demo:  garayaa0606@gmail.com / admin123 (con 5 unidades)');
}

seed().catch(err => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
