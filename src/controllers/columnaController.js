const Columna = require('../models/columnaModel');

const obtenerColumnas = async (req, res) => {
  try {
    const columnas = await Columna.obtenerTodas();
    res.json(columnas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener columnas', detalles: error.message });
  }
};

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

const crearColumna = async (req, res) => {
  try {
    const { nombre, orden, wip_limit, id_tablero } = req.body;

    
    if (!nombre || !id_tablero) {
      return res.status(400).json({ 
        error: 'nombre e id_tablero son requeridos' 
      });
    }

    
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

const actualizarColumna = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, orden, wip_limit } = req.body;

    
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

const obtenerColumnasPorTablero = async (req, res) => {
  try {
    const { id_tablero } = req.params;
    const columnas = await Columna.obtenerPorTablero(id_tablero);
    
    res.json(columnas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener columnas del tablero', detalles: error.message });
  }
};

const obtenerColumnasConEnvios = async (req, res) => {
  try {
    const { id_tablero } = req.params;
    console.log(`Obteniendo columnas para tablero ${id_tablero}`);
    
    let columnas = await Columna.obtenerConEnvios(id_tablero);
    console.log(`Columnas obtenidas de BD: ${columnas.length}`);
    
    // Asegurar que siempre existan las 5 columnas requeridas
    const columnasRequeridas = [
      { nombre: 'recepción', orden: 1 },
      { nombre: 'clasificación', orden: 2 },
      { nombre: 'ruta', orden: 3 },
      { nombre: 'entregado', orden: 4 },
      { nombre: 'incidencia', orden: 5 }
    ];

    const nombresExistentes = columnas.map(c => c.nombre ? c.nombre.toLowerCase().trim() : '');
    console.log(`Nombres existentes:`, nombresExistentes);
    
    // Crear las columnas que faltan
    let columnasCreadas = false;
    for (const columnaReq of columnasRequeridas) {
      const nombreNormalizado = columnaReq.nombre.toLowerCase().trim();
      if (!nombresExistentes.includes(nombreNormalizado)) {
        console.log(`Creando columna faltante: ${columnaReq.nombre} para tablero ${id_tablero}`);
        try {
          const nuevaColumna = await Columna.crear({
            nombre: columnaReq.nombre,
            orden: columnaReq.orden,
            wip_limit: null,
            id_tablero: parseInt(id_tablero)
          });
          console.log(`Columna ${columnaReq.nombre} creada con ID: ${nuevaColumna.id_columna}`);
          columnasCreadas = true;
        } catch (err) {
          console.error(`Error al crear columna ${columnaReq.nombre}:`, err.message);
          console.error('Stack:', err.stack);
        }
      }
    }
    
    // Obtener las columnas nuevamente después de crear las faltantes
    if (columnasCreadas) {
      console.log('Recargando columnas después de crear nuevas...');
      columnas = await Columna.obtenerConEnvios(id_tablero);
      console.log(`Columnas después de crear: ${columnas.length}`);
    }
    
    // Asegurar que siempre tengamos las 5 columnas requeridas en la respuesta
    const columnasMap = new Map();
    columnas.forEach(col => {
      if (col.nombre) {
        const nombreKey = col.nombre.toLowerCase().trim();
        columnasMap.set(nombreKey, col);
        console.log(`Mapeando columna: ${col.nombre} -> ${nombreKey}, id: ${col.id_columna}`);
      }
    });
    
    // Crear array final con las 5 columnas requeridas
    const columnasFinales = columnasRequeridas.map(colReq => {
      const nombreNormalizado = colReq.nombre.toLowerCase().trim();
      const colExistente = columnasMap.get(nombreNormalizado);
      if (colExistente) {
        return colExistente;
      } else {
        // Si aún no existe, devolver una estructura básica
        console.log(`Columna ${colReq.nombre} no encontrada, usando estructura básica`);
        return {
          id_columna: null,
          nombre: colReq.nombre,
          orden: colReq.orden,
          wip_limit: null,
          envios: []
        };
      }
    });
    
    // Ordenar por orden para asegurar el orden correcto
    columnasFinales.sort((a, b) => (a.orden || 0) - (b.orden || 0));
    
    console.log(`Devolviendo ${columnasFinales.length} columnas para tablero ${id_tablero}`);
    console.log(`IDs de columnas:`, columnasFinales.map(c => `${c.nombre}:${c.id_columna}`).join(', '));
    res.json(columnasFinales);
  } catch (error) {
    console.error('Error en obtenerColumnasConEnvios:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ error: 'Error al obtener columnas con envíos', detalles: error.message });
  }
};

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

