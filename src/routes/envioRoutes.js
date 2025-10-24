const express = require('express');
const router = express.Router();
const {
  obtenerEnvios,
  obtenerEnvioPorId,
  crearEnvio,
  actualizarEnvio,
  eliminarEnvio,
  moverEnvio,
  obtenerEnviosPorColumna,
  obtenerEnviosPorUsuario,
  obtenerEnviosPorConductor,
  obtenerEnviosPorPrioridad,
  obtenerEnviosProximosAVencer,
  obtenerEstadisticasEnvios
} = require('../controllers/envioController');

// Rutas para envíos
router.get('/', obtenerEnvios);
router.get('/estadisticas', obtenerEstadisticasEnvios);
router.get('/proximos-vencer', obtenerEnviosProximosAVencer);
router.get('/:id', obtenerEnvioPorId);
router.post('/', crearEnvio);
router.put('/:id', actualizarEnvio);
router.delete('/:id', eliminarEnvio);

// Rutas específicas
router.post('/:id/mover', moverEnvio);
router.get('/columna/:id_columna', obtenerEnviosPorColumna);
router.get('/usuario/:id_usuario', obtenerEnviosPorUsuario);
router.get('/conductor/:id_conductor', obtenerEnviosPorConductor);
router.get('/prioridad/:prioridad', obtenerEnviosPorPrioridad);

module.exports = router;

