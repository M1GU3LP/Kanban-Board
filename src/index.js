const express = require('express');
const app = express();
const usuarioRoutes = require('./routes/usuarioRoutes');

app.use(express.json());
app.use('/usuarios', usuarioRoutes);

app.get('/', (req, res) => {
  res.send('API Kanban operativa. Usa /usuarios para ver usuarios.');
});

app.listen(3000, () => {
  console.log('🚀 Servidor corriendo en http://localhost:3000');
});
