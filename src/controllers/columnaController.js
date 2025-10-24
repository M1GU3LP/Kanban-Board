const Columna = require('../models/columnaModel');

// Obtener todas las columnas
const obtenerColumnas = async (req, res) => {
  try {
    const columnas = await Columna.obtenerTodas();
    res.json(columnas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener columnas', detalles: error.message });
  }
};

// Obtener columna por ID
const obtenerColumnaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const columna = await Columna.obtenerPorId(id);
    
    if (!columna) {
      return res.status(404).json({ error: 'Columna no encontrada' });
    }
    
    res.json(columna);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener columna', detalles: error.message });
  }
};

// Crear nueva columna
const crearColumna = async (req, res) => {
  try {
    const { nombre, orden, wip_limit, id_tablero } = req.body;

    // Validaciones
    if (!nombre || !id_tablero) {
      return res.status(400).json({ 
        error: 'nombre e id_tablero son requeridos' 
      });
    }

    // Validar que el nombre sea uno de los permitidos
    const nombresPermitidos = ['recepción', 'clasificación', 'ruta', 'entregado', 'incidencia'];
    if (!nombresPermitidos.includes(nombre)) {
      return res.status(400).json({ 
        error: 'nombre debe ser uno de: recepción, clasificación, ruta, entregado, incidencia' 
      });
    }

    const datosColumna = { 
      nombre, 
      orden: orden || 0, 
      wip_limit: wip_limit || null, 
      id_tablero 
    };
    
    const nuevaColumna = await Columna.crear(datosColumna);
    
    res.status(201).json({
      mensaje: 'Columna creada exitosamente',
      columna: nuevaColumna
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear columna', detalles: error.message });
  }
};

// Actualizar columna
const actualizarColumna = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, orden, wip_limit } = req.body;

    // Validaciones
    if (nombre) {
      const nombresPermitidos = ['recepción', 'clasificación', 'ruta', 'entregado', 'incidencia'];
      if (!nombresPermitidos.includes(nombre)) {
        return res.status(400).json({ 
          error: 'nombre debe ser uno de: recepción, clasificación, ruta, entregado, incidencia' 
        });
      }
    }

    const datosActualizacion = { nombre, orden, wip_limit };
    const columnaActualizada = await Columna.actualizar(id, datosActualizacion);
    
    res.json({
      mensaje: 'Columna actualizada exitosamente',
      columna: columnaActualizada
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar columna', detalles: error.message });
  }
};

// Eliminar columna
const eliminarColumna = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await Columna.eliminar(id);
    
    res.json({
      mensaje: 'Columna eliminada exitosamente',
      resultado
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar columna', detalles: error.message });
  }
};

// Obtener columnas por tablero
const obtenerColumnasPorTablero = async (req, res) => {
  try {
    const { id_tablero } = req.params;
    const columnas = await Columna.obtenerPorTablero(id_tablero);
    
    res.json(columnas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener columnas del tablero', detalles: error.message });
  }
};

// Obtener columnas con envíos
const obtenerColumnasConEnvios = async (req, res) => {
  try {
    const { id_tablero } = req.params;
    const columnas = await Columna.obtenerConEnvios(id_tablero);
    
    res.json(columnas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener columnas con envíos', detalles: error.message });
  }
};

// Verificar límite WIP
const verificarWipLimit = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await Columna.verificarWipLimit(id);
    
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: 'Error al verificar límite WIP', detalles: error.message });
  }
};

module.exports = {
  obtenerColumnas,
  obtenerColumnaPorId,
  crearColumna,
  actualizarColumna,
  eliminarColumna,
  obtenerColumnasPorTablero,
  obtenerColumnasConEnvios,
  verificarWipLimit
};

