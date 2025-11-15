-- DDL para crear las tablas necesarias para la app Kanban
-- Ejecuta este script antes de aplicar los seeds si la estructura no existe.

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS `Usuario` (
  `id_usuario` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(150) NOT NULL,
  `email` VARCHAR(200) NOT NULL UNIQUE,
  `contraseña_hash` VARCHAR(255) NOT NULL,
  `rol` VARCHAR(50) DEFAULT 'usuario',
  `fecha_registro` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `ultima_conexion` DATETIME DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Tablero` (
  `id_tablero` INT AUTO_INCREMENT PRIMARY KEY,
  `titulo` VARCHAR(200) NOT NULL,
  `descripcion` TEXT,
  `id_usuario` INT NOT NULL,
  `fecha_creacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_usuario`) REFERENCES `Usuario`(`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Columna` (
  `id_columna` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(150) NOT NULL,
  `orden` INT DEFAULT 0,
  `wip_limit` INT DEFAULT NULL,
  `id_tablero` INT NOT NULL,
  FOREIGN KEY (`id_tablero`) REFERENCES `Tablero`(`id_tablero`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Envio` (
  `id_envio` INT AUTO_INCREMENT PRIMARY KEY,
  `descripcion` TEXT,
  `peso` DECIMAL(8,2) DEFAULT 0,
  `dimensiones` VARCHAR(100) DEFAULT NULL,
  `fecha_estimada_entrega` DATETIME DEFAULT NULL,
  `prioridad` VARCHAR(20) DEFAULT 'media',
  `id_columna` INT DEFAULT NULL,
  `id_usuario` INT DEFAULT NULL,
  `id_conductor` INT DEFAULT NULL,
  `fecha_creacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_columna`) REFERENCES `Columna`(`id_columna`) ON DELETE SET NULL,
  FOREIGN KEY (`id_usuario`) REFERENCES `Usuario`(`id_usuario`) ON DELETE SET NULL,
  FOREIGN KEY (`id_conductor`) REFERENCES `Usuario`(`id_usuario`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Reporte` (
  `id_reporte` INT AUTO_INCREMENT PRIMARY KEY,
  `tipo` VARCHAR(80) NOT NULL,
  `descripcion` TEXT,
  `id_envio` INT DEFAULT NULL,
  `id_usuario` INT DEFAULT NULL,
  `fecha` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_envio`) REFERENCES `Envio`(`id_envio`) ON DELETE SET NULL,
  FOREIGN KEY (`id_usuario`) REFERENCES `Usuario`(`id_usuario`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
