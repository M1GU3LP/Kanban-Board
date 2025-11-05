const conexion = require('../config/db');

const Envio = {
  
  obtenerTodos: () => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT e.*, 
               c.nombre as columna_nombre,
               c.orden as columna_orden,
               t.titulo as tablero_titulo,
               u1.nombre as usuario_nombre,
               u2.nombre as conductor_nombre
        FROM Envio e
        LEFT JOIN Columna c ON e.id_columna = c.id_columna
        LEFT JOIN Tablero t ON c.id_tablero = t.id_tablero
        LEFT JOIN Usuario u1 ON e.id_usuario = u1.id_usuario
        LEFT JOIN Usuario u2 ON e.id_conductor = u2.id_usuario
        ORDER BY e.fecha_creacion DESC
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
        SELECT e.*, 
               c.nombre as columna_nombre,
               c.orden as columna_orden,
               t.titulo as tablero_titulo,
               u1.nombre as usuario_nombre,
               u2.nombre as conductor_nombre
        FROM Envio e
        LEFT JOIN Columna c ON e.id_columna = c.id_columna
        LEFT JOIN Tablero t ON c.id_tablero = t.id_tablero
        LEFT JOIN Usuario u1 ON e.id_usuario = u1.id_usuario
        LEFT JOIN Usuario u2 ON e.id_conductor = u2.id_usuario
        WHERE e.id_envio = ?
      `;
      conexion.query(sql, [id], (err, resultados) => {
        if (err) reject(err);
        else resolve(resultados[0]);
      });
    });
  },

  
  crear: (datos) => {
    return new Promise((resolve, reject) => {
      const { descripcion, peso, dimensiones, fecha_estimada_entrega, prioridad, id_columna, id_usuario, id_conductor } = datos;
      const sql = `
        INSERT INTO Envio (descripcion, peso, dimensiones, fecha_estimada_entrega, prioridad, id_columna, id_usuario, id_conductor, fecha_creacion) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;
      conexion.query(sql, [descripcion, peso, dimensiones, fecha_estimada_entrega, prioridad, id_columna, id_usuario, id_conductor], (err, resultado) => {
        if (err) reject(err);
        else resolve({ id_envio: resultado.insertId, ...datos });
      });
    });
  },

  
  actualizar: (id, datos) => {
    return new Promise((resolve, reject) => {
      const { descripcion, peso, dimensiones, fecha_estimada_entrega, prioridad, id_conductor } = datos;
      const sql = `
        UPDATE Envio 
        SET descripcion = ?, peso = ?, dimensiones = ?, fecha_estimada_entrega = ?, prioridad = ?, id_conductor = ?
        WHERE id_envio = ?
      `;
      conexion.query(sql, [descripcion, peso, dimensiones, fecha_estimada_entrega, prioridad, id_conductor, id], (err, resultado) => {
        if (err) reject(err);
        else resolve({ id_envio: id, ...datos });
      });
    });
  },

  
  eliminar: (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM Envio WHERE id_envio = ?';
      conexion.query(sql, [id], (err, resultado) => {
        if (err) reject(err);
        else resolve({ eliminado: true, id_envio: id });
      });
    });
  },

 
  moverAColumna: (id_envio, id_columna) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE Envio SET id_columna = ? WHERE id_envio = ?';
      conexion.query(sql, [id_columna, id_envio], (err, resultado) => {
        if (err) reject(err);
        else resolve({ id_envio, id_columna });
      });
    });
  },

  
  obtenerPorColumna: (id_columna) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT e.*, 
               u1.nombre as usuario_nombre,
               u2.nombre as conductor_nombre
        FROM Envio e
        LEFT JOIN Usuario u1 ON e.id_usuario = u1.id_usuario
        LEFT JOIN Usuario u2 ON e.id_conductor = u2.id_usuario
        WHERE e.id_columna = ?
        ORDER BY e.prioridad DESC, e.fecha_creacion ASC
      `;
      conexion.query(sql, [id_columna], (err, resultados) => {
        if (err) reject(err);
        else resolve(resultados);
      });
    });
  },

  
  obtenerPorUsuario: (id_usuario) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT e.*, 
               c.nombre as columna_nombre,
               t.titulo as tablero_titulo,
               u2.nombre as conductor_nombre
        FROM Envio e
        LEFT JOIN Columna c ON e.id_columna = c.id_columna
        LEFT JOIN Tablero t ON c.id_tablero = t.id_tablero
        LEFT JOIN Usuario u2 ON e.id_conductor = u2.id_usuario
        WHERE e.id_usuario = ?
        ORDER BY e.fecha_creacion DESC
      `;
      conexion.query(sql, [id_usuario], (err, resultados) => {
        if (err) reject(err);
        else resolve(resultados);
      });
    });
  },

  
  obtenerPorConductor: (id_conductor) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT e.*, 
               c.nombre as columna_nombre,
               t.titulo as tablero_titulo,
               u1.nombre as usuario_nombre
        FROM Envio e
        LEFT JOIN Columna c ON e.id_columna = c.id_columna
        LEFT JOIN Tablero t ON c.id_tablero = t.id_tablero
        LEFT JOIN Usuario u1 ON e.id_usuario = u1.id_usuario
        WHERE e.id_conductor = ?
        ORDER BY e.fecha_creacion DESC
      `;
      conexion.query(sql, [id_conductor], (err, resultados) => {
        if (err) reject(err);
        else resolve(resultados);
      });
    });
  },


  obtenerPorPrioridad: (prioridad) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT e.*, 
               c.nombre as columna_nombre,
               t.titulo as tablero_titulo,
               u1.nombre as usuario_nombre,
               u2.nombre as conductor_nombre
        FROM Envio e
        LEFT JOIN Columna c ON e.id_columna = c.id_columna
        LEFT JOIN Tablero t ON c.id_tablero = t.id_tablero
        LEFT JOIN Usuario u1 ON e.id_usuario = u1.id_usuario
        LEFT JOIN Usuario u2 ON e.id_conductor = u2.id_usuario
        WHERE e.prioridad = ?
        ORDER BY e.fecha_creacion ASC
      `;
      conexion.query(sql, [prioridad], (err, resultados) => {
        if (err) reject(err);
        else resolve(resultados);
      });
    });
  },

  
  obtenerProximosAVencer: (dias = 7) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT e.*, 
               c.nombre as columna_nombre,
               t.titulo as tablero_titulo,
               u1.nombre as usuario_nombre,
               u2.nombre as conductor_nombre,
               DATEDIFF(e.fecha_estimada_entrega, CURDATE()) as dias_restantes
        FROM Envio e
        LEFT JOIN Columna c ON e.id_columna = c.id_columna
        LEFT JOIN Tablero t ON c.id_tablero = t.id_tablero
        LEFT JOIN Usuario u1 ON e.id_usuario = u1.id_usuario
        LEFT JOIN Usuario u2 ON e.id_conductor = u2.id_usuario
        WHERE e.fecha_estimada_entrega BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
        AND c.nombre != 'entregado'
        ORDER BY e.fecha_estimada_entrega ASC
      `;
      conexion.query(sql, [dias], (err, resultados) => {
        if (err) reject(err);
        else resolve(resultados);
      });
    });
  },

  
  obtenerEstadisticas: () => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          COUNT(*) as total_envios,
          SUM(CASE WHEN c.nombre = 'recepción' THEN 1 ELSE 0 END) as en_recepcion,
          SUM(CASE WHEN c.nombre = 'clasificación' THEN 1 ELSE 0 END) as en_clasificacion,
          SUM(CASE WHEN c.nombre = 'ruta' THEN 1 ELSE 0 END) as en_ruta,
          SUM(CASE WHEN c.nombre = 'entregado' THEN 1 ELSE 0 END) as entregados,
          SUM(CASE WHEN c.nombre = 'incidencia' THEN 1 ELSE 0 END) as con_incidencias,
          SUM(CASE WHEN e.prioridad = 'alta' THEN 1 ELSE 0 END) as prioridad_alta,
          SUM(CASE WHEN e.prioridad = 'media' THEN 1 ELSE 0 END) as prioridad_media,
          SUM(CASE WHEN e.prioridad = 'baja' THEN 1 ELSE 0 END) as prioridad_baja
        FROM Envio e
        LEFT JOIN Columna c ON e.id_columna = c.id_columna
      `;
      conexion.query(sql, (err, resultados) => {
        if (err) reject(err);
        else resolve(resultados[0]);
      });
    });
  }
};

module.exports = Envio;

