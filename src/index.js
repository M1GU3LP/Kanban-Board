const express = require('express');
const app = express();

// Importar rutas
const usuarioRoutes = require('./routes/usuarioRoutes');
const tableroRoutes = require('./routes/tableroRoutes');
const columnaRoutes = require('./routes/columnaRoutes');
const envioRoutes = require('./routes/envioRoutes');
const reporteRoutes = require('./routes/reporteRoutes');

// Middleware
app.use(express.json());

// Configurar CORS para desarrollo
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Rutas
app.use('/usuarios', usuarioRoutes);
app.use('/tableros', tableroRoutes);
app.use('/columnas', columnaRoutes);
app.use('/envios', envioRoutes);
app.use('/reportes', reporteRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API Kanban operativa',
    version: '1.0.0',
    endpoints: {
      usuarios: '/usuarios',
      tableros: '/tableros',
      columnas: '/columnas',
      envios: '/envios',
      reportes: '/reportes'
    },
    documentacion: {
      tableros: {
        'GET /tableros': 'Obtener todos los tableros',
        'GET /tableros/:id': 'Obtener tablero por ID',
        'GET /tableros/:id/completo': 'Obtener tablero completo con columnas y envíos',
        'POST /tableros': 'Crear nuevo tablero',
        'PUT /tableros/:id': 'Actualizar tablero',
        'DELETE /tableros/:id': 'Eliminar tablero',
        'GET /tableros/usuario/:id_usuario': 'Obtener tableros por usuario'
      },
      columnas: {
        'GET /columnas': 'Obtener todas las columnas',
        'GET /columnas/:id': 'Obtener columna por ID',
        'POST /columnas': 'Crear nueva columna',
        'PUT /columnas/:id': 'Actualizar columna',
        'DELETE /columnas/:id': 'Eliminar columna',
        'GET /columnas/tablero/:id_tablero': 'Obtener columnas por tablero',
        'GET /columnas/tablero/:id_tablero/con-envios': 'Obtener columnas con envíos',
        'GET /columnas/:id/wip-limit': 'Verificar límite WIP'
      },
      envios: {
        'GET /envios': 'Obtener todos los envíos',
        'GET /envios/estadisticas': 'Obtener estadísticas de envíos',
        'GET /envios/proximos-vencer': 'Obtener envíos próximos a vencer',
        'GET /envios/:id': 'Obtener envío por ID',
        'POST /envios': 'Crear nuevo envío',
        'PUT /envios/:id': 'Actualizar envío',
        'DELETE /envios/:id': 'Eliminar envío',
        'POST /envios/:id/mover': 'Mover envío a otra columna',
        'GET /envios/columna/:id_columna': 'Obtener envíos por columna',
        'GET /envios/usuario/:id_usuario': 'Obtener envíos por usuario',
        'GET /envios/conductor/:id_conductor': 'Obtener envíos por conductor',
        'GET /envios/prioridad/:prioridad': 'Obtener envíos por prioridad'
      },
      reportes: {
        'GET /reportes': 'Obtener todos los reportes',
        'GET /reportes/estadisticas': 'Obtener estadísticas de reportes',
        'GET /reportes/recientes': 'Obtener reportes recientes',
        'GET /reportes/por-fechas': 'Obtener reportes por rango de fechas',
        'GET /reportes/:id': 'Obtener reporte por ID',
        'POST /reportes': 'Crear nuevo reporte',
        'PUT /reportes/:id': 'Actualizar reporte',
        'DELETE /reportes/:id': 'Eliminar reporte',
        'GET /reportes/envio/:id_envio': 'Obtener reportes por envío',
        'GET /reportes/usuario/:id_usuario': 'Obtener reportes por usuario',
        'GET /reportes/tipo/:tipo': 'Obtener reportes por tipo'
      }
    }
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    mensaje: err.message 
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    mensaje: `La ruta ${req.originalUrl} no existe` 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('🚀 Servidor corriendo en http://localhost:' + PORT);
  console.log('📋 API Kanban operativa');
  console.log('🔗 Endpoints disponibles:');
  console.log('   - Usuarios: /usuarios');
  console.log('   - Tableros: /tableros');
  console.log('   - Columnas: /columnas');
  console.log('   - Envíos: /envios');
  console.log('   - Reportes: /reportes');
});
