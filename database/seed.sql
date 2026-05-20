-- ============================================================
-- AgroBot-Alert - Datos de Semilla
-- ============================================================
-- USO: mysql -u root -p agro5 < seed.sql
-- ============================================================

USE agro5;

-- ============================================================
-- Usuario administrador (contraseña: admin123)
-- NOTA: El hash debe generarse con bcrypt. Si no funciona,
--       usa el endpoint POST /api/auth/register para crearlo.
-- ============================================================
INSERT INTO usuarios (email, nombre, contrasena, rol, telefono) VALUES
  ('admin@agrobot.com', 'Administrador', '$2b$10$8K1p/a0dL1LXMIgoEDFrwOfMQkfAjkMBcGmF0xP7FGxP/.KJFOxuS', 'admin',   null),
  ('garayaa0606@gmail.com', 'Usuario Demo', '$2b$10$8K1p/a0dL1LXMIgoEDFrwOfMQkfAjkMBcGmF0xP7FGxP/.KJFOxuS', 'usuario', '+56953818617');

-- ============================================================
-- Usuario para recuperación de contraseña
-- ============================================================
INSERT INTO users (username, email, password) VALUES
  ('Administrador', 'admin@agrobot.com', '$2b$10$8K1p/a0dL1LXMIgoEDFrwOfMQkfAjkMBcGmF0xP7FGxP/.KJFOxuS'),
  ('Usuario Demo',  'garayaa0606@gmail.com', '$2b$10$8K1p/a0dL1LXMIgoEDFrwOfMQkfAjkMBcGmF0xP7FGxP/.KJFOxuS');

-- ============================================================
-- Unidades de monitoreo (todas asignadas al usuario demo)
-- ============================================================
INSERT INTO unidades (id_unidad, nombre, id_usuario, latitude, longitude) VALUES
  (1001, 'Estacion Central',     2, -33.4567890, -70.6500000),
  (1002, 'Tractor 01 - Sur',     2, -33.5000000, -70.6200000),
  (1003, 'Estacion Norte',       2, -33.4000000, -70.7000000),
  (1004, 'Tractor 02 - Este',    2, -33.4800000, -70.5800000),
  (1005, 'Estacion Oeste',       2, -33.5200000, -70.7200000);

-- ============================================================
-- Sensores
-- ============================================================
INSERT INTO sensores (id_unidad, nombre, temperatura_s1, temperatura_s2, humedad_s1, humedad_s2, electroconductividad_s1, electroconductividad_s2, gps_energia, energia_externa) VALUES
  (1001, 'Sensor T-H Central',  25.3,  24.8,  65.2,  63.1,  1.2,  1.3,  4.8,  5.0),
  (1001, 'Sensor EC Central',   26.1,  25.4,  64.0,  62.5,  1.5,  1.6,  4.7,  5.0),
  (1002, 'Sensor Tractor Sur',  32.7,  31.9,  45.0,  43.2,  0.8,  0.9,  3.2,  4.1),
  (1003, 'Sensor Estación Norte', 18.5, 17.9,  78.3,  76.8,  1.0,  1.1,  4.9,  5.0),
  (1004, 'Sensor Tractor Este', 29.4,  28.7,  52.1,  50.3,  0.7,  0.8,  3.5,  4.3),
  (1005, 'Sensor Estación Oeste', 21.2, 20.6,  71.5,  70.0, 1.1,  1.2,  4.6,  5.0);

-- ============================================================
-- Mediciones de ejemplo (últimas 24h)
-- ============================================================
INSERT INTO mediciones (id_sensor, valor, timestamp) VALUES
  (1, '25.3', DATE_SUB(NOW(), INTERVAL 6 HOUR)),
  (1, '26.1', DATE_SUB(NOW(), INTERVAL 4 HOUR)),
  (1, '27.8', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
  (1, '26.5', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
  (2, '65.2', DATE_SUB(NOW(), INTERVAL 6 HOUR)),
  (2, '63.8', DATE_SUB(NOW(), INTERVAL 4 HOUR)),
  (2, '61.5', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
  (3, '32.7', DATE_SUB(NOW(), INTERVAL 5 HOUR)),
  (3, '34.2', DATE_SUB(NOW(), INTERVAL 3 HOUR)),
  (3, '36.0', DATE_SUB(NOW(), INTERVAL 1 HOUR));

-- ============================================================
-- Criterios para alertas
-- ============================================================
INSERT INTO criterios (nombre, accion, valor_referencia_max, valor_referencia_min) VALUES
  ('Temperatura alta',       'enviar_alerta_email_whatsapp', 35.0, NULL),
  ('Temperatura baja',       'enviar_alerta_email_whatsapp', NULL, 5.0),
  ('Humedad critica baja',   'enviar_alerta_email_whatsapp', NULL, 30.0),
  ('Humedad excesiva',       'enviar_alerta_email_whatsapp', 90.0, NULL),
  ('Bateria baja',           'enviar_alerta_email_whatsapp', NULL, 20.0);

-- ============================================================
-- Alertas de ejemplo
-- ============================================================
INSERT INTO alertas (mensaje, tipo, id_unidad, id_criterio, fecha_creacion) VALUES
  ('Temperatura alta detectada en Tractor 01 - Sur: 36.0°C', 'critico', 1002, 1, DATE_SUB(NOW(), INTERVAL 1 HOUR)),
  ('Batería baja en Estación Norte: 15% restante', 'advertencia', 1003, 5, DATE_SUB(NOW(), INTERVAL 3 HOUR)),
  ('Humedad crítica baja en Tractor 02 - Este: 28%', 'critico', 1004, 3, DATE_SUB(NOW(), INTERVAL 5 HOUR));

-- ============================================================
-- Campos agrícolas
-- ============================================================
INSERT INTO campos (nombre, ubicacion, hectareas) VALUES
  ('Campo Norte', 'Sector Norte - Parcela A', 120.50),
  ('Campo Sur',   'Sector Sur - Parcela B',   85.30),
  ('Campo Este',  'Sector Este - Parcela C',  95.00),
  ('Campo Oeste', 'Sector Oeste - Parcela D', 110.75);
