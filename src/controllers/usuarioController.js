const conexion = require('../config/db');
const bcrypt = require('bcryptjs');

const obtenerUsuarios = (req, res) => {
  conexion.query('SELECT * FROM Usuario', (err, resultados) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.json(resultados);
    }
  });
};

const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, contraseña, rol } = req.body;

    if (!nombre || !email || !contraseña || !rol) {
      return res.status(400).json({ error: 'nombre, email, contraseña y rol son requeridos' });
    }

    const rolesPermitidos = ['admin', 'operador', 'conductor', 'cliente'];
    if (!rolesPermitidos.includes(rol)) {
      return res.status(400).json({ error: 'rol inválido' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(contraseña, salt);

    const sql = 'INSERT INTO Usuario (nombre, email, `contraseña_hash`, rol) VALUES (?, ?, ?, ?)';
    conexion.query(sql, [nombre, email, hash, rol], (err, resultado) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.status(201).json({ id_usuario: resultado.insertId, nombre, email, rol });
    });
  } catch (e) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

module.exports = { obtenerUsuarios, crearUsuario };
