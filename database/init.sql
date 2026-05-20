-- ============================================================
-- AgroBot-Alert - Init Script (schema + seed)
-- Se ejecuta automáticamente al iniciar el contenedor MySQL
-- ============================================================

CREATE DATABASE IF NOT EXISTS agro5
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE agro5;

-- 1. usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  email       VARCHAR(255) NOT NULL UNIQUE,
  nombre      VARCHAR(100) NOT NULL,
  contrasena  VARCHAR(255) NOT NULL,
  rol         VARCHAR(50)  NOT NULL DEFAULT 'usuario',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. users (recuperación de contraseñas)
CREATE TABLE IF NOT EXISTS users (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  username              VARCHAR(100),
  email                 VARCHAR(255) NOT NULL UNIQUE,
  password              VARCHAR(255),
  resetPasswordToken    VARCHAR(255),
  resetPasswordExpires  BIGINT,
  created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. unidades
CREATE TABLE IF NOT EXISTS unidades (
  id_unidad   INT PRIMARY KEY,
  nombre      VARCHAR(150) NOT NULL,
  id_usuario  INT,
  latitude    DECIMAL(10, 7),
  longitude   DECIMAL(10, 7),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 4. sensores
CREATE TABLE IF NOT EXISTS sensores (
  id_sensor               INT AUTO_INCREMENT PRIMARY KEY,
  id_unidad               INT NOT NULL,
  nombre                  VARCHAR(150),
  temperatura_s1          DECIMAL(10, 2),
  temperatura_s2          DECIMAL(10, 2),
  humedad_s1              DECIMAL(10, 2),
  humedad_s2              DECIMAL(10, 2),
  electroconductividad_s1 DECIMAL(10, 2),
  electroconductividad_s2 DECIMAL(10, 2),
  gps_energia             DECIMAL(10, 2),
  energia_externa         DECIMAL(10, 2),
  created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_unidad) REFERENCES unidades(id_unidad)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 5. mediciones
CREATE TABLE IF NOT EXISTS mediciones (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  id_sensor   INT NOT NULL,
  valor       VARCHAR(255),
  timestamp   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_sensor) REFERENCES sensores(id_sensor)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 6. criterios
CREATE TABLE IF NOT EXISTS criterios (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  nombre                VARCHAR(150) NOT NULL,
  accion                VARCHAR(255),
  valor_referencia_max  DECIMAL(10, 2),
  valor_referencia_min  DECIMAL(10, 2),
  created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 7. alertas
CREATE TABLE IF NOT EXISTS alertas (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  mensaje         TEXT NOT NULL,
  tipo            VARCHAR(50),
  id_unidad       INT,
  id_criterio     INT,
  fecha_creacion  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_unidad) REFERENCES unidades(id_unidad)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_criterio) REFERENCES criterios(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 8. campos
CREATE TABLE IF NOT EXISTS campos (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(150) NOT NULL,
  ubicacion   VARCHAR(255),
  hectareas   DECIMAL(10, 2),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- SEED DATA
-- ============================================================

-- Usuarios (contraseña: admin123)
INSERT INTO usuarios (email, nombre, contrasena, rol) VALUES
  ('admin@agrobot.com', 'Administrador', '$2a$10$CnUgMbgAwP5R8.NL9YKR8u.0GJrC8gTLq6BIe7ixfoQM1ogWROD4u', 'admin'),
  ('demo@agrobot.com',  'Demo User',     '$2a$10$CnUgMbgAwP5R8.NL9YKR8u.0GJrC8gTLq6BIe7ixfoQM1ogWROD4u', 'usuario');

-- Tabla users (recuperación)
INSERT INTO users (username, email, password) VALUES
  ('Administrador', 'admin@agrobot.com', '$2a$10$CnUgMbgAwP5R8.NL9YKR8u.0GJrC8gTLq6BIe7ixfoQM1ogWROD4u');

-- Unidades
INSERT INTO unidades (id_unidad, nombre, id_usuario, latitude, longitude) VALUES
  (1001, 'Estacion Central',   1, -33.4567890, -70.6500000),
  (1002, 'Tractor 01 - Sur',   1, -33.5000000, -70.6200000),
  (1003, 'Estacion Norte',     1, -33.4000000, -70.7000000),
  (1004, 'Tractor 02 - Este',  2, -33.4800000, -70.5800000),
  (1005, 'Estacion Oeste',     2, -33.5200000, -70.7200000);

-- Sensores
INSERT INTO sensores (id_unidad, nombre, temperatura_s1, temperatura_s2, humedad_s1, humedad_s2, electroconductividad_s1, electroconductividad_s2, gps_energia, energia_externa) VALUES
  (1001, 'Sensor T-H Central',    25.3, 24.8, 65.2, 63.1, 1.2, 1.3, 4.8, 5.0),
  (1001, 'Sensor EC Central',     26.1, 25.4, 64.0, 62.5, 1.5, 1.6, 4.7, 5.0),
  (1002, 'Sensor Tractor Sur',    32.7, 31.9, 45.0, 43.2, 0.8, 0.9, 3.2, 4.1),
  (1003, 'Sensor Estacion Norte', 18.5, 17.9, 78.3, 76.8, 1.0, 1.1, 4.9, 5.0),
  (1004, 'Sensor Tractor Este',   29.4, 28.7, 52.1, 50.3, 0.7, 0.8, 3.5, 4.3),
  (1005, 'Sensor Estacion Oeste', 21.2, 20.6, 71.5, 70.0, 1.1, 1.2, 4.6, 5.0);

-- Criterios
INSERT INTO criterios (nombre, accion, valor_referencia_max, valor_referencia_min) VALUES
  ('Temperatura alta',     'enviar_alerta_whatsapp', 35.0, null),
  ('Temperatura baja',     'enviar_alerta_whatsapp', null, 5.0),
  ('Humedad critica baja', 'enviar_alerta_whatsapp', null, 30.0),
  ('Humedad excesiva',     'enviar_alerta_whatsapp', 90.0, null),
  ('Bateria baja',         'enviar_alerta_whatsapp', null, 20.0);

-- Alertas
INSERT INTO alertas (mensaje, tipo, id_unidad, id_criterio, fecha_creacion) VALUES
  ('Temperatura alta detectada en Tractor 01 - Sur: 36.0°C', 'critico', 1002, 1, NOW() - INTERVAL 1 HOUR),
  ('Bateria baja en Estacion Norte: 15% restante', 'advertencia', 1003, 5, NOW() - INTERVAL 3 HOUR),
  ('Humedad critica baja en Tractor 02 - Este: 28%', 'critico', 1004, 3, NOW() - INTERVAL 5 HOUR);

-- Campos
INSERT INTO campos (nombre, ubicacion, hectareas) VALUES
  ('Campo Norte', 'Sector Norte - Parcela A', 120.50),
  ('Campo Sur',   'Sector Sur - Parcela B',   85.30),
  ('Campo Este',  'Sector Este - Parcela C',  95.00),
  ('Campo Oeste', 'Sector Oeste - Parcela D', 110.75);
