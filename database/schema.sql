-- ============================================================
-- AgroBot-Alert - Esquema de Base de Datos MySQL
-- ============================================================
-- Generado a partir del análisis de controladores y modelos
-- ============================================================

CREATE DATABASE IF NOT EXISTS agro5
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE agro5;

-- ============================================================
-- 1. usuarios - Usuarios del sistema
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  email       VARCHAR(255) NOT NULL UNIQUE,
  nombre      VARCHAR(100) NOT NULL,
  contrasena  VARCHAR(255) NOT NULL,
  rol         VARCHAR(50)  NOT NULL DEFAULT 'usuario',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- 2. users - Tabla para recuperación de contraseñas
--    (separada de usuarios por diseño original)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  username              VARCHAR(100),
  email                 VARCHAR(255) NOT NULL UNIQUE,
  password              VARCHAR(255),
  resetPasswordToken    VARCHAR(255),
  resetPasswordExpires  BIGINT,
  created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- 3. unidades - Unidades de monitoreo (estaciones, tractores)
-- ============================================================
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

-- ============================================================
-- 4. sensores - Sensores asociados a unidades
-- ============================================================
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

-- ============================================================
-- 5. mediciones - Mediciones históricas de sensores
-- ============================================================
CREATE TABLE IF NOT EXISTS mediciones (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  id_sensor   INT NOT NULL,
  valor       VARCHAR(255),
  timestamp   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_sensor) REFERENCES sensores(id_sensor)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 6. criterios - Criterios para generación de alertas
-- ============================================================
CREATE TABLE IF NOT EXISTS criterios (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  nombre                VARCHAR(150) NOT NULL,
  accion                VARCHAR(255),
  valor_referencia_max  DECIMAL(10, 2),
  valor_referencia_min  DECIMAL(10, 2),
  created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- 7. alertas - Alertas generadas automáticamente
-- ============================================================
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

-- ============================================================
-- 8. campos - Campos agrícolas
-- ============================================================
CREATE TABLE IF NOT EXISTS campos (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(150) NOT NULL,
  ubicacion   VARCHAR(255),
  hectareas   DECIMAL(10, 2),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
