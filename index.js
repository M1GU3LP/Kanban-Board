const express = require('express');
const mysql = require('mysql2');

const app = express();

// Configura la conexión con tu base de datos de XAMPP
const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // usuario por defecto en XAMPP
  password: '',        // deja vacío si no tienes contraseña
  database: 'kanban'  // el nombre de tu base de datos
});

// Conectar a MySQL
conexion.connect(err => {
  if (err) {
    console.error('Error de conexión:', err);
    return;
  }
  console.log('✅ Conectado a la base de datos MySQL');
});

// Ruta de prueba
app.get('/', (req, res) => {
  conexion.query('SELECT * FROM Usuario', (err, resultados) => {
    if (err) throw err;
    res.json(resultados);
  });
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
