const express = require('express');
const router = express.Router();
const {
  obtenerTableros,
  obtenerTableroPorId,
  obtenerTableroCompleto,
  crearTablero,
  actualizarTablero,
  eliminarTablero,
  obtenerTablerosPorUsuario
} = require('../controllers/tableroController');

// Rutas para tableros
router.get('/', obtenerTableros);
router.get('/:id', obtenerTableroPorId);
router.get('/:id/completo', obtenerTableroCompleto);
router.post('/', crearTablero);
router.put('/:id', actualizarTablero);
router.delete('/:id', eliminarTablero);

// Rutas específicas
router.get('/usuario/:id_usuario', obtenerTablerosPorUsuario);

module.exports = router;

