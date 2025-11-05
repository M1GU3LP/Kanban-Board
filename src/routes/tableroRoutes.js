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


router.get('/', obtenerTableros);
router.get('/:id', obtenerTableroPorId);
router.get('/:id/completo', obtenerTableroCompleto);
router.post('/', crearTablero);
router.put('/:id', actualizarTablero);
router.delete('/:id', eliminarTablero);


router.get('/usuario/:id_usuario', obtenerTablerosPorUsuario);

module.exports = router;

