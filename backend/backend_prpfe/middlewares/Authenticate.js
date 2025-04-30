const jwt = require('jsonwebtoken');

// Middleware pour vérifier le token


const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  console.log("Token reçu :", token); // Debug 1

  if (!token) {
      return res.status(401).json({ error: 'Accès non autorisé, token manquant' });
  }

  try {
      const decoded = jwt.verify(token, 'secret-key');
      console.log("Token décodé :", decoded); // Debug 2
      req.user = decoded;
      next();
  } catch (error) {
      console.log("Erreur JWT :", error.message); // Debug 3
      res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};



module.exports = authenticate;
