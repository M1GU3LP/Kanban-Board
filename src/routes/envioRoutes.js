const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  obtenerEnvios,
  obtenerEnvioPorId,
  crearEnvio,
  crearEnvioCliente,
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

router.get('/', obtenerEnvios);
router.get('/estadisticas', obtenerEstadisticasEnvios);
router.get('/proximos-vencer', obtenerEnviosProximosAVencer);
router.get('/:id', obtenerEnvioPorId);
router.post('/', auth, crearEnvio);
router.post('/cliente', auth, crearEnvioCliente);
router.put('/:id', actualizarEnvio);
router.delete('/:id', eliminarEnvio);

router.post('/:id/mover', auth, moverEnvio);
router.get('/columna/:id_columna', obtenerEnviosPorColumna);
router.get('/usuario/:id_usuario', auth, obtenerEnviosPorUsuario);
router.get('/conductor/:id_conductor', obtenerEnviosPorConductor);
router.get('/prioridad/:prioridad', obtenerEnviosPorPrioridad);

module.exports = router;


