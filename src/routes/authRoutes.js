const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarioModel');
const auth = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_temporal'; 

router.post('/login', [
  check('email', 'Por favor incluya un email válido').isEmail(),
  check('contraseña', 'La contraseña es requerida').exists()
], async (req, res) => {

  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { email, contraseña } = req.body;

  try {
   
    const usuario = await Usuario.obtenerPorEmail(email);
    if (!usuario) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    
    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña_hash);
    if (!contraseñaValida) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    
    const payload = {
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        rol: usuario.rol
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});


router.get('/usuario', auth, async (req, res) => {
  try {
    const usuario = await Usuario.obtenerPorId(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // El modelo ya no devuelve contraseña_hash, pero por si acaso
    if (usuario.contraseña_hash) {
      delete usuario.contraseña_hash;
    }
    res.json(usuario);
  } catch (err) {
    console.error('Error en /auth/usuario:', err);
    console.error('Stack:', err.stack);
    res.status(500).json({ error: 'Error en el servidor', detalles: err.message });
  }
});


router.post('/registro', [
  check('nombre', 'El nombre es requerido').not().isEmpty(),
  check('email', 'Por favor incluya un email válido').isEmail(),
  check('contraseña', 'La contraseña debe tener 6 o más caracteres').isLength({ min: 6 }),
  check('rol', 'El rol es requerido').isIn(['admin', 'operador', 'conductor', 'cliente'])
], async (req, res) => {

  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { nombre, email, contraseña, rol } = req.body;

  try {
 
    let usuario = await Usuario.obtenerPorEmail(email);
    if (usuario) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }


    const nuevoUsuario = await Usuario.crear({
      nombre,
      email,
      contraseña,
      rol
    });

  
    const payload = {
      usuario: {
        id: nuevoUsuario.id_usuario,
        nombre: nuevoUsuario.nombre,
        rol: nuevoUsuario.rol
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;