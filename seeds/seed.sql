
-- Seed data for Kanban app (idempotent inserts)
-- NOTE: contraseña_hash values below are placeholders. To create users with
-- usable passwords run `node .\scripts\create_user.js <email> <password> <nombre> <rol>`
-- or use `node .\scripts\reset_password.js <email> <nuevaContraseña>` after applying this seed.

SET FOREIGN_KEY_CHECKS = 0;

-- Usuarios (placeholders for hashes)
INSERT INTO Usuario (id_usuario, nombre, email, contraseña_hash, rol, fecha_registro)
VALUES
	(1, 'Admin', 'admin@example.com', '$2a$10$abcdefghijklmnopqrstuv1234567890abcd', 'admin', NOW()),
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), email = VALUES(email), rol = VALUES(rol);

-- Tablero
INSERT INTO Tablero (id_tablero, titulo, descripcion, id_usuario, fecha_creacion)
VALUES
	(1, 'Tablero Principal', 'Tablero de prueba con columnas y envíos', 1, NOW())
ON DUPLICATE KEY UPDATE titulo = VALUES(titulo), descripcion = VALUES(descripcion);

-- Columnas
INSERT INTO Columna (id_columna, nombre, orden, wip_limit, id_tablero)
VALUES
	(1, 'recepción', 1, NULL, 1),
	(2, 'clasificación', 2, NULL, 1),
	(3, 'ruta', 3, NULL, 1),
	(4, 'entregado', 4, NULL, 1),
	(5, 'incidencia', 5, NULL, 1)
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), orden = VALUES(orden), wip_limit = VALUES(wip_limit);

-- Envíos
INSERT INTO Envio (id_envio, descripcion, peso, dimensiones, fecha_estimada_entrega, prioridad, id_columna, id_usuario, id_conductor, fecha_creacion)
VALUES
	(1, 'paquete a', 2.5, '30x20x10', DATE_ADD(NOW(), INTERVAL 3 DAY), 'media', 1, 3, NULL, NOW()),
	(2, 'paquete b', 1.2, '20x15x8', DATE_ADD(NOW(), INTERVAL 5 DAY), 'baja', 2, 3, NULL, NOW()),
	(3, 'paquete c', 4.0, '40x30x20', DATE_ADD(NOW(), INTERVAL 2 DAY), 'alta', 3, 3, 2, NOW()),
	(4, 'paquete d', 0.8, '15x10x5', DATE_ADD(NOW(), INTERVAL 1 DAY), 'media', 4, 3, 2, NOW()),
	(5, 'paquete e', 3.2, '35x25x15', DATE_ADD(NOW(), INTERVAL 7 DAY), 'baja', 5, 3, NULL, NOW())
ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion), id_columna = VALUES(id_columna);

-- Reportes
INSERT INTO Reporte (id_reporte, tipo, descripcion, id_envio, id_usuario, fecha)
VALUES
	(1, 'incidente', 'Etiqueta dañada', 3, 3, NOW()),
	(2, 'retraso', 'Retraso por clima', 1, 3, NOW())
ON DUPLICATE KEY UPDATE tipo = VALUES(tipo), descripcion = VALUES(descripcion);

SET FOREIGN_KEY_CHECKS = 1;

-- After running this seed you should set real passwords for users with:
-- node .\scripts\reset_password.js admin@example.com admin123
