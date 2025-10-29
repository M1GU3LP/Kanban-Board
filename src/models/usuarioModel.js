const conexion = require('../config/db');
const bcrypt = require('bcryptjs');

const Usuario = {
  obtenerTodos: () => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT id_usuario, nombre, email, rol, fecha_registro, ultima_conexion 
        FROM Usuario
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
        SELECT id_usuario, nombre, email, rol, fecha_registro, ultima_conexion 
        FROM Usuario 
        WHERE id_usuario = ?
      `;
      conexion.query(sql, [id], (err, resultados) => {
        if (err) reject(err);
        else resolve(resultados[0]);
      });
    });
  },

  
  obtenerPorEmail: (email) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM Usuario WHERE email = ?';
      conexion.query(sql, [email], (err, resultados) => {
        if (err) reject(err);
        else resolve(resultados[0]);
      });
    });
  },

  
  crear: async (datos) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { nombre, email, contraseña, rol } = datos;

        
        const salt = await bcrypt.genSalt(10);
        const contraseñaHash = await bcrypt.hash(contraseña, salt);

        const sql = `
          INSERT INTO Usuario (nombre, email, contraseña_hash, rol, fecha_registro) 
          VALUES (?, ?, ?, ?, NOW())
        `;
        
        conexion.query(sql, [nombre, email, contraseñaHash, rol], (err, resultado) => {
          if (err) reject(err);
          else resolve({
            id_usuario: resultado.insertId,
            nombre,
            email,
            rol
          });
        });
      } catch (err) {
        reject(err);
      }
    });
  },

  
  actualizar: (id, datos) => {
    return new Promise((resolve, reject) => {
      const { nombre, email, rol } = datos;
      const sql = `
        UPDATE Usuario 
        SET nombre = ?, email = ?, rol = ?
        WHERE id_usuario = ?
      `;
      conexion.query(sql, [nombre, email, rol, id], (err, resultado) => {
        if (err) reject(err);
        else resolve({ id_usuario: id, ...datos });
      });
    });
  },

 
  actualizarContraseña: async (id, nuevaContraseña) => {
    return new Promise(async (resolve, reject) => {
      try {
        const salt = await bcrypt.genSalt(10);
        const contraseñaHash = await bcrypt.hash(nuevaContraseña, salt);

        const sql = 'UPDATE Usuario SET contraseña_hash = ? WHERE id_usuario = ?';
        conexion.query(sql, [contraseñaHash, id], (err, resultado) => {
          if (err) reject(err);
          else resolve({ actualizado: true });
        });
      } catch (err) {
        reject(err);
      }
    });
  },

  
  actualizarUltimaConexion: (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE Usuario SET ultima_conexion = NOW() WHERE id_usuario = ?';
      conexion.query(sql, [id], (err, resultado) => {
        if (err) reject(err);
        else resolve({ actualizado: true });
      });
    });
  },

 
  eliminar: (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM Usuario WHERE id_usuario = ?';
      conexion.query(sql, [id], (err, resultado) => {
        if (err) reject(err);
        else resolve({ eliminado: true });
      });
    });
  },

 
  existeEmail: (email) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT COUNT(*) as count FROM Usuario WHERE email = ?';
      conexion.query(sql, [email], (err, resultados) => {
        if (err) reject(err);
        else resolve(resultados[0].count > 0);
      });
    });
  }
};

module.exports = Usuario;
