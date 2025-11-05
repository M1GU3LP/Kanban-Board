const conexion = require('../config/db');

const Reporte = {
  
  obtenerTodos: () => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT r.*, 
               e.descripcion as envio_descripcion,
               u.nombre as usuario_nombre,
               c.nombre as columna_nombre,
               t.titulo as tablero_titulo
        FROM Reporte r
        LEFT JOIN Envio e ON r.id_envio = e.id_envio
        LEFT JOIN Usuario u ON r.id_usuario = u.id_usuario
        LEFT JOIN Columna c ON e.id_columna = c.id_columna
        LEFT JOIN Tablero t ON c.id_tablero = t.id_tablero
        ORDER BY r.fecha DESC
      `;
      conexion.query(sql, (err, resultados) => {
        if (err) reject(err);
        else resolve(resultados);
      });
    });
  },

  
  obtenerPorId: (id) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT r.*, 
               e.descripcion as envio_descripcion,
               u.nombre as usuario_nombre,
               c.nombre as columna_nombre,
               t.titulo as tablero_titulo
        FROM Reporte r
        LEFT JOIN Envio e ON r.id_envio = e.id_envio
        LEFT JOIN Usuario u ON r.id_usuario = u.id_usuario
        LEFT JOIN Columna c ON e.id_columna = c.id_columna
        LEFT JOIN Tablero t ON c.id_tablero = t.id_tablero
        WHERE r.id_reporte = ?
      `;
      conexion.query(sql, [id], (err, resultados) => {
        if (err) reject(err);
        else resolve(resultados[0]);
      });
    });
  },

  
  crear: (datos) => {
    return new Promise((resolve, reject) => {
      const { tipo, descripcion, id_envio, id_usuario } = datos;
      const sql = `
        INSERT INTO Reporte (tipo, descripcion, id_envio, id_usuario, fecha) 
        VALUES (?, ?, ?, ?, NOW())
      `;
      conexion.query(sql, [tipo, descripcion, id_envio, id_usuario], (err, resultado) => {
        if (err) reject(err);
        else resolve({ id_reporte: resultado.insertId, ...datos });
      });
    });
  },

 
  actualizar: (id, datos) => {
    return new Promise((resolve, reject) => {
      const { tipo, descripcion } = datos;
      const sql = `
        UPDATE Reporte 
        SET tipo = ?, descripcion = ?
        WHERE id_reporte = ?
      `;
      conexion.query(sql, [tipo, descripcion, id], (err, resultado) => {
        if (err) reject(err);
        else resolve({ id_reporte: id, ...datos });
      });
    });
  },

 
  eliminar: (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM Reporte WHERE id_reporte = ?';
      conexion.query(sql, [id], (err, resultado) => {
        if (err) reject(err);
        else resolve({ eliminado: true, id_reporte: id });
      });
    });
  },

  
  obtenerPorEnvio: (id_envio) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT r.*, u.nombre as usuario_nombre
        FROM Reporte r
        LEFT JOIN Usuario u ON r.id_usuario = u.id_usuario
        WHERE r.id_envio = ?
        ORDER BY r.fecha DESC
      `;
      conexion.query(sql, [id_envio], (err, resultados) => {
        if (err) reject(err);
        else resolve(resultados);
      });
    });
  },

  
  obtenerPorUsuario: (id_usuario) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT r.*, 
               e.descripcion as envio_descripcion,
               c.nombre as columna_nombre,
               t.titulo as tablero_titulo
        FROM Reporte r
        LEFT JOIN Envio e ON r.id_envio = e.id_envio
        LEFT JOIN Columna c ON e.id_columna = c.id_columna
        LEFT JOIN Tablero t ON c.id_tablero = t.id_tablero
        WHERE r.id_usuario = ?
        ORDER BY r.fecha DESC
      `;
      conexion.query(sql, [id_usuario], (err, resultados) => {
        if (err) reject(err);
        else resolve(resultados);
      });
    });
  },

  
  obtenerPorTipo: (tipo) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT r.*, 
               e.descripcion as envio_descripcion,
               u.nombre as usuario_nombre,
               c.nombre as columna_nombre,
               t.titulo as tablero_titulo
        FROM Reporte r
        LEFT JOIN Envio e ON r.id_envio = e.id_envio
        LEFT JOIN Usuario u ON r.id_usuario = u.id_usuario
        LEFT JOIN Columna c ON e.id_columna = c.id_columna
        LEFT JOIN Tablero t ON c.id_tablero = t.id_tablero
        WHERE r.tipo = ?
        ORDER BY r.fecha DESC
      `;
      conexion.query(sql, [tipo], (err, resultados) => {
        if (err) reject(err);
        else resolve(resultados);
      });
    });
  },

 
  obtenerPorFechas: (fecha_inicio, fecha_fin) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT r.*, 
               e.descripcion as envio_descripcion,
               u.nombre as usuario_nombre,
               c.nombre as columna_nombre,
               t.titulo as tablero_titulo
        FROM Reporte r
        LEFT JOIN Envio e ON r.id_envio = e.id_envio
        LEFT JOIN Usuario u ON r.id_usuario = u.id_usuario
        LEFT JOIN Columna c ON e.id_columna = c.id_columna
        LEFT JOIN Tablero t ON c.id_tablero = t.id_tablero
        WHERE r.fecha BETWEEN ? AND ?
        ORDER BY r.fecha DESC
      `;
      conexion.query(sql, [fecha_inicio, fecha_fin], (err, resultados) => {
        if (err) reject(err);
        else resolve(resultados);
      });
    });
  },

  
  obtenerEstadisticas: () => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          COUNT(*) as total_reportes,
          SUM(CASE WHEN tipo = 'tiempo' THEN 1 ELSE 0 END) as reportes_tiempo,
          SUM(CASE WHEN tipo = 'retraso' THEN 1 ELSE 0 END) as reportes_retraso,
          SUM(CASE WHEN tipo = 'incidente' THEN 1 ELSE 0 END) as reportes_incidente,
          SUM(CASE WHEN tipo = 'devolucion' THEN 1 ELSE 0 END) as reportes_devolucion,
          COUNT(DISTINCT id_envio) as envios_con_reportes,
          COUNT(DISTINCT id_usuario) as usuarios_reportando
        FROM Reporte
      `;
      conexion.query(sql, (err, resultados) => {
        if (err) reject(err);
        else resolve(resultados[0]);
      });
    });
  },

  
  obtenerRecientes: (dias = 7) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT r.*, 
               e.descripcion as envio_descripcion,
               u.nombre as usuario_nombre,
               c.nombre as columna_nombre,
               t.titulo as tablero_titulo
        FROM Reporte r
        LEFT JOIN Envio e ON r.id_envio = e.id_envio
        LEFT JOIN Usuario u ON r.id_usuario = u.id_usuario
        LEFT JOIN Columna c ON e.id_columna = c.id_columna
        LEFT JOIN Tablero t ON c.id_tablero = t.id_tablero
        WHERE r.fecha >= DATE_SUB(NOW(), INTERVAL ? DAY)
        ORDER BY r.fecha DESC
      `;
      conexion.query(sql, [dias], (err, resultados) => {
        if (err) reject(err);
        else resolve(resultados);
      });
    });
  }
};

module.exports = Reporte;

