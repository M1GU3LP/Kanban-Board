const Envio = require('../models/envioModel');
const Columna = require('../models/columnaModel');

// Obtener todos los envíos
const obtenerEnvios = async (req, res) => {
  try {
    const envios = await Envio.obtenerTodos();
    res.json(envios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener envíos', detalles: error.message });
  }
};

// Obtener envío por ID
const obtenerEnvioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const envio = await Envio.obtenerPorId(id);
    
    if (!envio) {
      return res.status(404).json({ error: 'Envío no encontrado' });
    }
    
    res.json(envio);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener envío', detalles: error.message });
  }
};

// Crear nuevo envío
const crearEnvio = async (req, res) => {
  try {
    const { 
      descripcion, 
      peso, 
      dimensiones, 
      fecha_estimada_entrega, 
      prioridad, 
      id_columna, 
      id_usuario, 
      id_conductor 
    } = req.body;

    // Validaciones
    if (!descripcion || !id_columna || !id_usuario) {
      return res.status(400).json({ 
        error: 'descripcion, id_columna e id_usuario son requeridos' 
      });
    }

    // Validar prioridad
    const prioridadesPermitidas = ['alta', 'media', 'baja'];
    if (prioridad && !prioridadesPermitidas.includes(prioridad)) {
      return res.status(400).json({ 
        error: 'prioridad debe ser: alta, media o baja' 
      });
    }

    // Verificar límite WIP de la columna
    const wipCheck = await Columna.verificarWipLimit(id_columna);
    if (!wipCheck.puedeAgregar) {
      return res.status(400).json({ 
        error: `Límite WIP alcanzado. Columna tiene ${wipCheck.envios_actuales}/${wipCheck.wip_limit} envíos` 
      });
    }

    const datosEnvio = { 
      descripcion, 
      peso, 
      dimensiones, 
      fecha_estimada_entrega, 
      prioridad: prioridad || 'media', 
      id_columna, 
      id_usuario, 
      id_conductor 
    };
    
    const nuevoEnvio = await Envio.crear(datosEnvio);
    
    res.status(201).json({
      mensaje: 'Envío creado exitosamente',
      envio: nuevoEnvio
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear envío', detalles: error.message });
  }
};

// Actualizar envío
const actualizarEnvio = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      descripcion, 
      peso, 
      dimensiones, 
      fecha_estimada_entrega, 
      prioridad, 
      id_conductor 
    } = req.body;

    // Validar prioridad si se proporciona
    if (prioridad) {
      const prioridadesPermitidas = ['alta', 'media', 'baja'];
      if (!prioridadesPermitidas.includes(prioridad)) {
        return res.status(400).json({ 
          error: 'prioridad debe ser: alta, media o baja' 
        });
      }
    }

    const datosActualizacion = { 
      descripcion, 
      peso, 
      dimensiones, 
      fecha_estimada_entrega, 
      prioridad, 
      id_conductor 
    };
    
    const envioActualizado = await Envio.actualizar(id, datosActualizacion);
    
    res.json({
      mensaje: 'Envío actualizado exitosamente',
      envio: envioActualizado
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar envío', detalles: error.message });
  }
};

// Eliminar envío
const eliminarEnvio = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await Envio.eliminar(id);
    
    res.json({
      mensaje: 'Envío eliminado exitosamente',
      resultado
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar envío', detalles: error.message });
  }
};

// Mover envío a otra columna
const moverEnvio = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_columna } = req.body;

    if (!id_columna) {
      return res.status(400).json({ error: 'id_columna es requerido' });
    }

    // Verificar límite WIP de la columna destino
    const wipCheck = await Columna.verificarWipLimit(id_columna);
    if (!wipCheck.puedeAgregar) {
      return res.status(400).json({ 
        error: `Límite WIP alcanzado. Columna tiene ${wipCheck.envios_actuales}/${wipCheck.wip_limit} envíos` 
      });
    }

    const resultado = await Envio.moverAColumna(id, id_columna);
    
    res.json({
      mensaje: 'Envío movido exitosamente',
      resultado
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al mover envío', detalles: error.message });
  }
};

// Obtener envíos por columna
const obtenerEnviosPorColumna = async (req, res) => {
  try {
    const { id_columna } = req.params;
    const envios = await Envio.obtenerPorColumna(id_columna);
    
    res.json(envios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener envíos de la columna', detalles: error.message });
  }
};

// Obtener envíos por usuario
const obtenerEnviosPorUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const envios = await Envio.obtenerPorUsuario(id_usuario);
    
    res.json(envios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener envíos del usuario', detalles: error.message });
  }
};

// Obtener envíos por conductor
const obtenerEnviosPorConductor = async (req, res) => {
  try {
    const { id_conductor } = req.params;
    const envios = await Envio.obtenerPorConductor(id_conductor);
    
    res.json(envios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener envíos del conductor', detalles: error.message });
  }
};

// Obtener envíos por prioridad
const obtenerEnviosPorPrioridad = async (req, res) => {
  try {
    const { prioridad } = req.params;
    const envios = await Envio.obtenerPorPrioridad(prioridad);
    
    res.json(envios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener envíos por prioridad', detalles: error.message });
  }
};

// Obtener envíos próximos a vencer
const obtenerEnviosProximosAVencer = async (req, res) => {
  try {
    const { dias } = req.query;
    const diasParam = dias ? parseInt(dias) : 7;
    const envios = await Envio.obtenerProximosAVencer(diasParam);
    
    res.json(envios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener envíos próximos a vencer', detalles: error.message });
  }
};

// Obtener estadísticas de envíos
const obtenerEstadisticasEnvios = async (req, res) => {
  try {
    const estadisticas = await Envio.obtenerEstadisticas();
    res.json(estadisticas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estadísticas', detalles: error.message });
  }
};

module.exports = {
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
};

