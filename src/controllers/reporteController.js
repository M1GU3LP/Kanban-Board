const Reporte = require('../models/reporteModel');


const obtenerReportes = async (req, res) => {
  try {
    const reportes = await Reporte.obtenerTodos();
    res.json(reportes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reportes', detalles: error.message });
  }
};


const obtenerReportePorId = async (req, res) => {
  try {
    const { id } = req.params;
    const reporte = await Reporte.obtenerPorId(id);
    
    if (!reporte) {
      return res.status(404).json({ error: 'Reporte no encontrado' });
    }
    
    res.json(reporte);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reporte', detalles: error.message });
  }
};


const crearReporte = async (req, res) => {
  try {
    const { tipo, descripcion, id_envio, id_usuario } = req.body;

    
    if (!tipo || !descripcion || !id_envio || !id_usuario) {
      return res.status(400).json({ 
        error: 'tipo, descripcion, id_envio e id_usuario son requeridos' 
      });
    }

    
    const tiposPermitidos = ['tiempo', 'retraso', 'incidente', 'devolucion'];
    if (!tiposPermitidos.includes(tipo)) {
      return res.status(400).json({ 
        error: 'tipo debe ser uno de: tiempo, retraso, incidente, devolucion' 
      });
    }

    const datosReporte = { tipo, descripcion, id_envio, id_usuario };
    const nuevoReporte = await Reporte.crear(datosReporte);
    
    res.status(201).json({
      mensaje: 'Reporte creado exitosamente',
      reporte: nuevoReporte
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear reporte', detalles: error.message });
  }
};


const actualizarReporte = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, descripcion } = req.body;

    
    if (tipo) {
      const tiposPermitidos = ['tiempo', 'retraso', 'incidente', 'devolucion'];
      if (!tiposPermitidos.includes(tipo)) {
        return res.status(400).json({ 
          error: 'tipo debe ser uno de: tiempo, retraso, incidente, devolucion' 
        });
      }
    }

    const datosActualizacion = { tipo, descripcion };
    const reporteActualizado = await Reporte.actualizar(id, datosActualizacion);
    
    res.json({
      mensaje: 'Reporte actualizado exitosamente',
      reporte: reporteActualizado
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar reporte', detalles: error.message });
  }
};


const eliminarReporte = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await Reporte.eliminar(id);
    
    res.json({
      mensaje: 'Reporte eliminado exitosamente',
      resultado
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar reporte', detalles: error.message });
  }
};


const obtenerReportesPorEnvio = async (req, res) => {
  try {
    const { id_envio } = req.params;
    const reportes = await Reporte.obtenerPorEnvio(id_envio);
    
    res.json(reportes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reportes del envío', detalles: error.message });
  }
};

const obtenerReportesPorUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const reportes = await Reporte.obtenerPorUsuario(id_usuario);
    
    res.json(reportes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reportes del usuario', detalles: error.message });
  }
};


const obtenerReportesPorTipo = async (req, res) => {
  try {
    const { tipo } = req.params;
    const reportes = await Reporte.obtenerPorTipo(tipo);
    
    res.json(reportes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reportes por tipo', detalles: error.message });
  }
};


const obtenerReportesPorFechas = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;
    
    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({ 
        error: 'fecha_inicio y fecha_fin son requeridos' 
      });
    }

    const reportes = await Reporte.obtenerPorFechas(fecha_inicio, fecha_fin);
    res.json(reportes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reportes por fechas', detalles: error.message });
  }
};


const obtenerReportesRecientes = async (req, res) => {
  try {
    const { dias } = req.query;
    const diasParam = dias ? parseInt(dias) : 7;
    const reportes = await Reporte.obtenerRecientes(diasParam);
    
    res.json(reportes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reportes recientes', detalles: error.message });
  }
};


const obtenerEstadisticasReportes = async (req, res) => {
  try {
    const estadisticas = await Reporte.obtenerEstadisticas();
    res.json(estadisticas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estadísticas de reportes', detalles: error.message });
  }
};

module.exports = {
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
};

