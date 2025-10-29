const Tablero = require('../models/tableroModel');

const obtenerTableros = async (req, res) => {
  try {
    const tableros = await Tablero.obtenerTodos();
    res.json(tableros);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tableros', detalles: error.message });
  }
};

const obtenerTableroPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const tablero = await Tablero.obtenerPorId(id);
    
    if (!tablero) {
      return res.status(404).json({ error: 'Tablero no encontrado' });
    }
    
    res.json(tablero);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tablero', detalles: error.message });
  }
};

const obtenerTableroCompleto = async (req, res) => {
  try {
    const { id } = req.params;
    const tablero = await Tablero.obtenerCompleto(id);
    
    if (!tablero.id_tablero) {
      return res.status(404).json({ error: 'Tablero no encontrado' });
    }
    
    res.json(tablero);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tablero completo', detalles: error.message });
  }
};

const crearTablero = async (req, res) => {
  try {
    const { titulo, descripcion, id_usuario } = req.body;

    // Validaciones
    if (!titulo || !descripcion || !id_usuario) {
      return res.status(400).json({ 
        error: 'titulo, descripcion e id_usuario son requeridos' 
      });
    }

    const datosTablero = { titulo, descripcion, id_usuario };
    const nuevoTablero = await Tablero.crear(datosTablero);
    
    res.status(201).json({
      mensaje: 'Tablero creado exitosamente',
      tablero: nuevoTablero
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear tablero', detalles: error.message });
  }
};

const actualizarTablero = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion } = req.body;

    // Validaciones
    if (!titulo || !descripcion) {
      return res.status(400).json({ 
        error: 'titulo y descripcion son requeridos' 
      });
    }

    const datosActualizacion = { titulo, descripcion };
    const tableroActualizado = await Tablero.actualizar(id, datosActualizacion);
    
    res.json({
      mensaje: 'Tablero actualizado exitosamente',
      tablero: tableroActualizado
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar tablero', detalles: error.message });
  }
};

const eliminarTablero = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await Tablero.eliminar(id);
    
    res.json({
      mensaje: 'Tablero eliminado exitosamente',
      resultado
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar tablero', detalles: error.message });
  }
};

const obtenerTablerosPorUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const tableros = await Tablero.obtenerPorUsuario(id_usuario);
    
    res.json(tableros);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tableros del usuario', detalles: error.message });
  }
};

module.exports = {
  obtenerTableros,
  obtenerTableroPorId,
  obtenerTableroCompleto,
  crearTablero,
  actualizarTablero,
  eliminarTablero,
  obtenerTablerosPorUsuario
};

