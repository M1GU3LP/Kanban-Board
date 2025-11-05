const conexion = require('../config/db');

const Columna = {
  
  obtenerTodas: () => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT c.*, t.titulo as tablero_titulo 
        FROM Columna c 
        LEFT JOIN Tablero t ON c.id_tablero = t.id_tablero
        ORDER BY c.id_tablero, c.orden ASC
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
        SELECT c.*, t.titulo as tablero_titulo 
        FROM Columna c 
        LEFT JOIN Tablero t ON c.id_tablero = t.id_tablero
        WHERE c.id_columna = ?
      `;
      conexion.query(sql, [id], (err, resultados) => {
        if (err) reject(err);
        else resolve(resultados[0]);
      });
    });
  },


  crear: (datos) => {
    return new Promise((resolve, reject) => {
      const { nombre, orden, wip_limit, id_tablero } = datos;
      const sql = `
        INSERT INTO Columna (nombre, orden, wip_limit, id_tablero) 
        VALUES (?, ?, ?, ?)
      `;
      conexion.query(sql, [nombre, orden, wip_limit, id_tablero], (err, resultado) => {
        if (err) reject(err);
        else resolve({ id_columna: resultado.insertId, ...datos });
      });
    });
  },

  
  actualizar: (id, datos) => {
    return new Promise((resolve, reject) => {
      const { nombre, orden, wip_limit } = datos;
      const sql = `
        UPDATE Columna 
        SET nombre = ?, orden = ?, wip_limit = ?
        WHERE id_columna = ?
      `;
      conexion.query(sql, [nombre, orden, wip_limit, id], (err, resultado) => {
        if (err) reject(err);
        else resolve({ id_columna: id, ...datos });
      });
    });
  },

  
  eliminar: (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM Columna WHERE id_columna = ?';
      conexion.query(sql, [id], (err, resultado) => {
        if (err) reject(err);
        else resolve({ eliminado: true, id_columna: id });
      });
    });
  },

  
  obtenerPorTablero: (id_tablero) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT c.*, 
               COUNT(e.id_envio) as cantidad_envios,
               t.titulo as tablero_titulo
        FROM Columna c 
        LEFT JOIN Envio e ON c.id_columna = e.id_columna
        LEFT JOIN Tablero t ON c.id_tablero = t.id_tablero
        WHERE c.id_tablero = ?
        GROUP BY c.id_columna
        ORDER BY c.orden ASC
      `;
      conexion.query(sql, [id_tablero], (err, resultados) => {
        if (err) reject(err);
        else resolve(resultados);
      });
    });
  },

  
  obtenerConEnvios: (id_tablero) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          c.id_columna,
          c.nombre,
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
        FROM Columna c
        LEFT JOIN Envio e ON c.id_columna = e.id_columna
        LEFT JOIN Usuario u1 ON e.id_usuario = u1.id_usuario
        LEFT JOIN Usuario u2 ON e.id_conductor = u2.id_usuario
        WHERE c.id_tablero = ?
        ORDER BY c.orden ASC, e.fecha_creacion ASC
      `;
      conexion.query(sql, [id_tablero], (err, resultados) => {
        if (err) reject(err);
        else {
          
          const columnasMap = new Map();
          
          resultados.forEach(row => {
            if (!columnasMap.has(row.id_columna)) {
              columnasMap.set(row.id_columna, {
                id_columna: row.id_columna,
                nombre: row.nombre,
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

          const columnas = Array.from(columnasMap.values());
          resolve(columnas);
        }
      });
    });
  },

  
  verificarWipLimit: (id_columna) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT c.wip_limit, COUNT(e.id_envio) as envios_actuales
        FROM Columna c
        LEFT JOIN Envio e ON c.id_columna = e.id_columna
        WHERE c.id_columna = ?
        GROUP BY c.id_columna
      `;
      conexion.query(sql, [id_columna], (err, resultados) => {
        if (err) reject(err);
        else {
          const columna = resultados[0];
          const puedeAgregar = !columna.wip_limit || columna.envios_actuales < columna.wip_limit;
          resolve({ puedeAgregar, envios_actuales: columna.envios_actuales, wip_limit: columna.wip_limit });
        }
      });
    });
  }
};

module.exports = Columna;

