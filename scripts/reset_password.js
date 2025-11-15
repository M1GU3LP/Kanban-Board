const Usuario = require('../src/models/usuarioModel');
const conexion = require('../src/config/db');

async function run() {
  const email = process.argv[2];
  const nueva = process.argv[3];

  if (!email || !nueva) {
    console.log('Uso: node .\\scripts\\reset_password.js <email> <nuevaContraseña>');
    process.exit(1);
  }

  try {
    console.log('Conectando a la base de datos...');

    const usuario = await Usuario.obtenerPorEmail(email);
    if (!usuario) {
      console.error('No se encontró usuario con ese email:', email);
      process.exit(2);
    }

    await Usuario.actualizarContraseña(usuario.id_usuario, nueva);
    console.log('Contraseña actualizada para', email);
    process.exit(0);
  } catch (err) {
    console.error('Error al actualizar contraseña:', err.sqlMessage || err.message || err);
    process.exit(1);
  }
}

run();
