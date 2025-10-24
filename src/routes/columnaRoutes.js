const express = require('express');
const router = express.Router();
const {
  obtenerColumnas,
  obtenerColumnaPorId,
  crearColumna,
  actualizarColumna,
  eliminarColumna,
  obtenerColumnasPorTablero,
  obtenerColumnasConEnvios,
  verificarWipLimit
} = require('../controllers/columnaController');

// Rutas para columnas
router.get('/', obtenerColumnas);
router.get('/:id', obtenerColumnaPorId);
router.post('/', crearColumna);
router.put('/:id', actualizarColumna);
router.delete('/:id', eliminarColumna);

// Rutas específicas
router.get('/tablero/:id_tablero', obtenerColumnasPorTablero);
router.get('/tablero/:id_tablero/con-envios', obtenerColumnasConEnvios);
router.get('/:id/wip-limit', verificarWipLimit);

module.exports = router;

