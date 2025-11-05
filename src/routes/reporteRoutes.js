const express = require('express');
const router = express.Router();
const {
  obtenerReportes,
  obtenerReportePorId,
  crearReporte,
  actualizarReporte,
  eliminarReporte,
  obtenerReportesPorEnvio,
  obtenerReportesPorUsuario,
  obtenerReportesPorTipo,
  obtenerReportesPorFechas,
  obtenerReportesRecientes,
  obtenerEstadisticasReportes
} = require('../controllers/reporteController');


router.get('/', obtenerReportes);
router.get('/estadisticas', obtenerEstadisticasReportes);
router.get('/recientes', obtenerReportesRecientes);
router.get('/por-fechas', obtenerReportesPorFechas);
router.get('/:id', obtenerReportePorId);
router.post('/', crearReporte);
router.put('/:id', actualizarReporte);
router.delete('/:id', eliminarReporte);


router.get('/envio/:id_envio', obtenerReportesPorEnvio);
router.get('/usuario/:id_usuario', obtenerReportesPorUsuario);
router.get('/tipo/:tipo', obtenerReportesPorTipo);

module.exports = router;

