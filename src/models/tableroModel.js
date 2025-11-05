const conexion = require('../config/db');

const Tablero = {
  
  obtenerTodos: () => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT t.*, u.nombre as creador_nombre 
        FROM Tablero t 
        LEFT JOIN Usuario u ON t.id_usuario = u.id_usuario
        ORDER BY t.fecha_creacion DESC
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
        SELECT t.*, u.nombre as creador_nombre 
        FROM Tablero t 
        LEFT JOIN Usuario u ON t.id_usuario = u.id_usuario
        WHERE t.id_tablero = ?
      `;
      conexion.query(sql, [id], (err, resultados) => {
        if (err) reject(err);
        else resolve(resultados[0]);
      });
    });
  },

  
  crear: (datos) => {
    return new Promise((resolve, reject) => {
      const { titulo, descripcion, id_usuario } = datos;
      const sql = `
        INSERT INTO Tablero (titulo, descripcion, id_usuario, fecha_creacion) 
        VALUES (?, ?, ?, NOW())
      `;
      conexion.query(sql, [titulo, descripcion, id_usuario], (err, resultado) => {
        if (err) reject(err);
        else resolve({ id_tablero: resultado.insertId, ...datos });
      });
    });
  },

  
  actualizar: (id, datos) => {
    return new Promise((resolve, reject) => {
      const { titulo, descripcion } = datos;
      const sql = `
        UPDATE Tablero 
        SET titulo = ?, descripcion = ?
        WHERE id_tablero = ?
      `;
      conexion.query(sql, [titulo, descripcion, id], (err, resultado) => {
        if (err) reject(err);
        else resolve({ id_tablero: id, ...datos });
      });
    });
  },

  
  eliminar: (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM Tablero WHERE id_tablero = ?';
      conexion.query(sql, [id], (err, resultado) => {
        if (err) reject(err);
        else resolve({ eliminado: true, id_tablero: id });
      });
    });
  },

  
  obtenerPorUsuario: (id_usuario) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT t.*, u.nombre as creador_nombre 
        FROM Tablero t 
        LEFT JOIN Usuario u ON t.id_usuario = u.id_usuario
        WHERE t.id_usuario = ?
        ORDER BY t.fecha_creacion DESC
      `;
      conexion.query(sql, [id_usuario], (err, resultados) => {
        if (err) reject(err);
        else resolve(resultados);
      });
    });
  },

  
  obtenerCompleto: (id) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          t.id_tablero,
          t.titulo,
          t.descripcion,
          t.fecha_creacion,
          c.id_columna,
          c.nombre as columna_nombre,
          c.orden,
          c.wip_limit,
          e.id_envio,
          e.descripcion as envio_descripcion,
          e.peso,
          e.dimensiones,
          e.fecha_creacion as envio_fecha_creacion,
          e.fecha_estimada_entrega,
          e.prioridad,
          u1.nombre as usuario_nombre,
          u2.nombre as conductor_nombre
        FROM Tablero t
        LEFT JOIN Columna c ON t.id_tablero = c.id_tablero
        LEFT JOIN Envio e ON c.id_columna = e.id_columna
        LEFT JOIN Usuario u1 ON e.id_usuario = u1.id_usuario
        LEFT JOIN Usuario u2 ON e.id_conductor = u2.id_usuario
        WHERE t.id_tablero = ?
        ORDER BY c.orden ASC, e.fecha_creacion ASC
      `;
      conexion.query(sql, [id], (err, resultados) => {
        if (err) reject(err);
        else {
          
          const tablero = {
            id_tablero: resultados[0]?.id_tablero,
            titulo: resultados[0]?.titulo,
            descripcion: resultados[0]?.descripcion,
            fecha_creacion: resultados[0]?.fecha_creacion,
            columnas: []
          };

          const columnasMap = new Map();
          
          resultados.forEach(row => {
            if (row.id_columna && !columnasMap.has(row.id_columna)) {
              columnasMap.set(row.id_columna, {
                id_columna: row.id_columna,
                nombre: row.columna_nombre,
                orden: row.orden,
                wip_limit: row.wip_limit,
                envios: []
              });
            }

            if (row.id_envio) {
              const columna = columnasMap.get(row.id_columna);
              columna.envios.push({
                id_envio: row.id_envio,
                descripcion: row.envio_descripcion,
                peso: row.peso,
                dimensiones: row.dimensiones,
                fecha_creacion: row.envio_fecha_creacion,
                fecha_estimada_entrega: row.fecha_estimada_entrega,
                prioridad: row.prioridad,
                usuario_nombre: row.usuario_nombre,
                conductor_nombre: row.conductor_nombre
              });
            }
          });

          tablero.columnas = Array.from(columnasMap.values());
          resolve(tablero);
        }
      });
    });
  }
};

module.exports = Tablero;
