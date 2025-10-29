const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_temporal';

const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ 
      error: 'No hay token, autorización denegada' 
    });
  }

  try {
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    
    req.usuario = decoded.usuario;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token no válido' });
  }
};

module.exports = authMiddleware;