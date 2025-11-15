const Envio = require('../models/envioModel');
const Columna = require('../models/columnaModel');

const obtenerEnvios = async (req, res) => {
  try {
    const envios = await Envio.obtenerTodos();
    res.json(envios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener envíos', detalles: error.message });
  }
};

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

// Endpoint para que clientes creen envíos
const crearEnvioCliente = async (req, res) => {
  try {
    // Validar que el usuario tenga rol cliente
    if (!req.usuario || req.usuario.rol !== 'cliente') {
      return res.status(403).json({ 
        error: 'Solo los clientes pueden usar este endpoint' 
      });
    }

    const { 
      descripcion, 
      peso, 
      dimensiones, 
      fecha_estimada_entrega, 
      prioridad, 
      id_columna
    } = req.body;

    if (!descripcion || !id_columna) {
      return res.status(400).json({ 
        error: 'descripcion e id_columna son requeridos' 
      });
    }

    const prioridadesPermitidas = ['alta', 'media', 'baja'];
    if (prioridad && !prioridadesPermitidas.includes(prioridad)) {
      return res.status(400).json({ 
        error: 'prioridad debe ser: alta, media o baja' 
      });
    }

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
      id_usuario: req.usuario.id, // El ID del usuario viene del token JWT
      id_conductor: null
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

const crearEnvio = async (req, res) => {
  try {
    // Validar que el usuario tenga rol admin u operador
    if (!req.usuario || (req.usuario.rol !== 'admin' && req.usuario.rol !== 'operador')) {
      return res.status(403).json({ 
        error: 'No tienes permisos para crear envíos. Solo administradores y operadores pueden crear envíos.' 
      });
    }

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

    if (!descripcion || !id_columna) {
      return res.status(400).json({ 
        error: 'descripcion e id_columna son requeridos' 
      });
    }

    // Usar el id_usuario del token si no se proporciona en el body
    const usuarioId = id_usuario || req.usuario.id;

    const prioridadesPermitidas = ['alta', 'media', 'baja'];
    if (prioridad && !prioridadesPermitidas.includes(prioridad)) {
      return res.status(400).json({ 
        error: 'prioridad debe ser: alta, media o baja' 
      });
    }

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
      id_usuario: usuarioId, 
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


const moverEnvio = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_columna } = req.body;

    if (!req.usuario) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (!id_columna) {
      return res.status(400).json({ error: 'id_columna es requerido' });
    }

    // Obtener información del envío y la columna destino
    const envio = await Envio.obtenerPorId(id);
    if (!envio) {
      return res.status(404).json({ error: 'Envío no encontrado' });
    }

    const columnaDestino = await Columna.obtenerPorId(id_columna);
    if (!columnaDestino) {
      return res.status(404).json({ error: 'Columna destino no encontrada' });
    }

    const nombreColumnaDestino = columnaDestino.nombre.toLowerCase().trim();
    const nombreColumnaOrigen = envio.columna_nombre ? envio.columna_nombre.toLowerCase().trim() : '';

    // Validar permisos según rol
    if (req.usuario.rol === 'operador') {
      // Operadores pueden mover desde recepción o clasificación a: clasificación, ruta o incidencia
      const columnasOrigenPermitidas = ['recepción', 'clasificación'];
      const columnasDestinoPermitidas = ['clasificación', 'ruta', 'incidencia'];
      
      if (!columnasOrigenPermitidas.includes(nombreColumnaOrigen)) {
        return res.status(403).json({ 
          error: 'Los operadores solo pueden mover paquetes desde: recepción o clasificación' 
        });
      }
      
      if (!columnasDestinoPermitidas.includes(nombreColumnaDestino)) {
        return res.status(403).json({ 
          error: 'Los operadores solo pueden mover paquetes a: clasificación, ruta o incidencia' 
        });
      }
    } else if (req.usuario.rol === 'conductor') {
      // Conductores solo pueden mover desde ruta a: entregado o incidencia
      if (nombreColumnaOrigen !== 'ruta') {
        return res.status(403).json({ 
          error: 'Los conductores solo pueden mover paquetes desde la columna ruta' 
        });
      }
      const columnasPermitidas = ['entregado', 'incidencia'];
      if (!columnasPermitidas.includes(nombreColumnaDestino)) {
        return res.status(403).json({ 
          error: 'Los conductores solo pueden mover paquetes a: entregado o incidencia' 
        });
      }
    } else if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ 
        error: 'No tienes permisos para mover envíos' 
      });
    }

    // Verificar límite WIP
    const wipCheck = await Columna.verificarWipLimit(id_columna);
    if (!wipCheck.puedeAgregar) {
      return res.status(400).json({ 
        error: `Límite WIP alcanzado. Columna tiene ${wipCheck.envios_actuales}/${wipCheck.wip_limit} envíos` 
      });
    }

    // Mover el envío (esto actualiza id_columna, eliminando el registro de la columna anterior)
    const resultado = await Envio.moverAColumna(id, id_columna);
    
    res.json({
      mensaje: 'Envío movido exitosamente',
      resultado,
      requiereReporte: nombreColumnaDestino === 'incidencia'
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al mover envío', detalles: error.message });
  }
};


const obtenerEnviosPorColumna = async (req, res) => {
  try {
    const { id_columna } = req.params;
    const envios = await Envio.obtenerPorColumna(id_columna);
    
    res.json(envios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener envíos de la columna', detalles: error.message });
  }
};


const obtenerEnviosPorUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    
    // Si el usuario es cliente, solo puede ver sus propios envíos
    if (req.usuario && req.usuario.rol === 'cliente') {
      if (parseInt(id_usuario) !== req.usuario.id) {
        return res.status(403).json({ 
          error: 'No tienes permisos para ver envíos de otros usuarios' 
        });
      }
    }
    
    const envios = await Envio.obtenerPorUsuario(id_usuario);
    
    res.json(envios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener envíos del usuario', detalles: error.message });
  }
};


const obtenerEnviosPorConductor = async (req, res) => {
  try {
    const { id_conductor } = req.params;
    const envios = await Envio.obtenerPorConductor(id_conductor);
    
    res.json(envios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener envíos del conductor', detalles: error.message });
  }
};


const obtenerEnviosPorPrioridad = async (req, res) => {
  try {
    const { prioridad } = req.params;
    const envios = await Envio.obtenerPorPrioridad(prioridad);
    
    res.json(envios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener envíos por prioridad', detalles: error.message });
  }
};


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
};

