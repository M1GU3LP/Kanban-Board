const fs = require('fs');
const path = require('path');
const conexion = require('../src/config/db');

async function applySeed() {
  try {
    console.log('✅ Conectando a la base de datos MySQL...');
    
    const seedPath = path.join(__dirname, 'seed.sql');
    if (!fs.existsSync(seedPath)) {
      throw new Error(`Archivo seed.sql no encontrado en ${seedPath}`);
    }

    const sql = fs.readFileSync(seedPath, 'utf8');
    
    // Dividir por puntos y coma, filtrar vacíos y comentarios
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📋 Ejecutando ${statements.length} sentencias SQL...`);

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      await new Promise((resolve, reject) => {
        conexion.query(stmt, (err, results) => {
          if (err) {
            console.error(`❌ Error en sentencia ${i + 1}:`, err.message);
            return reject(err);
          }
          console.log(`✓ Sentencia ${i + 1} ejecutada`);
          resolve(results);
        });
      });
    }

    console.log('\n✅ ¡Seed aplicado exitosamente!');
    console.log('📊 Verifica en tu BD que las columnas y envíos se crearon correctamente.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error aplicando seed:', err.message || err);
    process.exit(1);
  }
}

applySeed();
