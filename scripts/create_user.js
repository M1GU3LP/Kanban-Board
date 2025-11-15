const fs = require('fs');
const path = require('path');
const Usuario = require('../src/models/usuarioModel');
const conexion = require('../src/config/db');

async function applyDDLIfNeeded() {
  try {
    const ddlPath = path.join(__dirname, '..', 'seeds', 'create_tables.sql');
    if (!fs.existsSync(ddlPath)) {
      // nothing to do
      return;
    }

    const sql = fs.readFileSync(ddlPath, 'utf8');
    const statements = sql
      .split(/;\s*\n/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && !/^--/.test(s));

    console.log(`Aplicando DDL desde ${ddlPath} (${statements.length} sentencias)...`);
    for (const stmt of statements) {
      await new Promise((resolve, reject) => {
        conexion.query(stmt, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    }
    console.log('DDL aplicado (si era necesario).');
  } catch (err) {
    console.error('Error aplicando DDL:', err.message || err);
    // continue; maybe tables already exist partially
  }
}

async function ensureUsuarioColumns() {
  try {
    // Check for fecha_registro and contraseña_hash columns
    const needed = [];
    const checkColumn = (col) => new Promise((resolve, reject) => {
      const sql = `SELECT COUNT(*) as cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Usuario' AND COLUMN_NAME = ?`;
      conexion.query(sql, [col], (err, results) => {
        if (err) return reject(err);
        resolve(results[0].cnt > 0);
      });
    });

    const hasFecha = await checkColumn('fecha_registro');
    if (!hasFecha) needed.push(`ALTER TABLE Usuario ADD COLUMN fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP`);

    const hasContra = await checkColumn('contraseña_hash');
    if (!hasContra) needed.push(`ALTER TABLE Usuario ADD COLUMN contraseña_hash VARCHAR(255) NOT NULL`);

    if (needed.length === 0) return;

    console.log('Se detectaron columnas faltantes en Usuario. Ejecutando ALTER TABLE...');
    for (const stmt of needed) {
      await new Promise((resolve, reject) => {
        conexion.query(stmt, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
      console.log('Ejecutado:', stmt);
    }
    console.log('Columnas faltantes añadidas.');
  } catch (err) {
    console.error('Error asegurando columnas en Usuario:', err.sqlMessage || err.message || err);
  }
}

async function run() {
  const email = process.argv[2] || 'admin@example.com';
  const password = process.argv[3] || 'admin123';
  const nombre = process.argv[4] || 'Admin';
  const rol = process.argv[5] || 'admin';

  if (!process.argv[2] || !process.argv[3]) {
    console.log('No se proporcionaron email/contraseña. Se usarán valores por defecto:');
    console.log(`  email: ${email}`);
    console.log(`  contraseña: ${password}`);
  }

  try {
    // Primero intentar aplicar DDL para asegurar las columnas/tablas necesarias
    await applyDDLIfNeeded();
  // Asegurar columnas críticas que podrían faltar en esquemas previos
  await ensureUsuarioColumns();

    const exists = await Usuario.existeEmail(email);
    if (exists) {
      console.log(`El email ${email} ya existe en la base de datos. No se creó un nuevo usuario.`);
      process.exit(0);
    }

    const creado = await Usuario.crear({ nombre, email, contraseña: password, rol });
    console.log('Usuario creado:', creado);
    process.exit(0);
  } catch (err) {
    console.error('Error creando usuario:', err.sqlMessage || err.message || err);
    process.exit(1);
  }
}

run();
